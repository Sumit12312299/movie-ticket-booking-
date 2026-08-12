import random
import string
import qrcode
import io
import base64
import logging
from datetime import datetime
from fastapi import APIRouter, HTTPException, Depends, status
from typing import List
from app.database.db import get_database
from app.schemas.booking_schema import SeatLockRequest, BookingCreate, BookingResponse
from app.schemas.user_schema import UserProfile
from app.services.auth_service import get_current_user
from app.services.seat_locking_service import seat_lock_service

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/bookings", tags=["Bookings"])

def generate_booking_ref() -> str:
    """
    Generates a unique booking reference formatted CT-XXXXXXXX.
    """
    chars = string.ascii_uppercase + string.digits
    return "CT-" + "".join(random.choices(chars, k=8))

def generate_qr_code_base64(data_string: str) -> str:
    try:
        qr = qrcode.QRCode(version=1, box_size=4, border=2)
        qr.add_data(data_string)
        qr.make(fit=True)
        img = qr.make_image(fill_color="black", back_color="white")
        buffered = io.BytesIO()
        img.save(buffered, format="PNG")
        return "data:image/png;base64," + base64.b64encode(buffered.getvalue()).decode()
    except Exception:
        # Fallback simple QR representation if qrcode module issue
        return f"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100'><text x='10' y='50' font-size='10'>QR-{data_string[-6:]}</text></svg>"

@router.post("/lock-seats", summary="Temporarily lock seats for checkout")
async def lock_seats(
    request: SeatLockRequest,
    current_user: UserProfile = Depends(get_current_user)
):
    """
    Acquire temporary lock leases on requested seats for 5 minutes during checkout.
    Prevents race conditions and double bookings.
    """
    db = get_database()
    showtimes_col = db["showtimes"]

    st = await showtimes_col.find_one({"_id": request.showtime_id})
    if not st:
        raise HTTPException(status_code=404, detail="Showtime not found")

    booked = st.get("booked_seats", [])
    for seat in request.seats:
        if seat in booked:
            raise HTTPException(status_code=400, detail=f"Seat {seat} has already been booked by another customer")

    logger.info("Locking seats %s for showtime %s by user %s", request.seats, request.showtime_id, current_user.id)
    # Call seat locking service to lock seats for 5 minutes during checkout
    success, msg = seat_lock_service.lock_seats(request.showtime_id, request.seats, current_user.id)
    if not success:
        logger.warning("Failed to lock seats %s for showtime %s: %s", request.seats, request.showtime_id, msg)
        raise HTTPException(status_code=409, detail=msg)

    return {"status": "success", "message": "Seats locked for 5 minutes", "seats": request.seats}

@router.post("/unlock-seats", summary="Release temporary seat locks")
async def unlock_seats(
    request: SeatLockRequest,
    current_user: UserProfile = Depends(get_current_user)
):
    """
    Manually release active temporary seat locks when user cancels or leaves checkout page.
    """
    logger.info("Releasing seat locks on %s for showtime %s by user %s", request.seats, request.showtime_id, current_user.id)
    seat_lock_service.release_seats(request.showtime_id, request.seats, current_user.id)
    return {"status": "success", "message": "Seats unlocked successfully"}

@router.post("", response_model=BookingResponse, status_code=status.HTTP_201_CREATED)
async def create_booking(
    booking_data: BookingCreate,
    current_user: UserProfile = Depends(get_current_user)
):
    db = get_database()
    showtimes_col = db["showtimes"]
    bookings_col = db["bookings"]
    users_col = db["users"]

    st = await showtimes_col.find_one({"_id": booking_data.showtime_id})
    if not st:
        raise HTTPException(status_code=404, detail="Showtime not found")

    booked_seats = set(st.get("booked_seats", []))
    for seat in booking_data.seats:
        if seat in booked_seats:
            raise HTTPException(status_code=400, detail=f"Seat {seat} is no longer available")

    # If paying by Digital Wallet, check & deduct wallet balance
    is_wallet_payment = booking_data.payment_method in ["Digital Wallet", "Wallet", "Cineticket Wallet", "BookTicket Wallet", "Bookticket Wallet"]
    if is_wallet_payment:
        user_doc = await users_col.find_one({"_id": current_user.id})
        current_wallet = float(user_doc.get("wallet_balance", 1500.0)) if user_doc else current_user.wallet_balance
        if current_wallet < booking_data.total_amount:
            raise HTTPException(
                status_code=400,
                detail=f"Insufficient wallet balance (₹{current_wallet:,.2f}). Total amount is ₹{booking_data.total_amount:,.2f}. Please top up your wallet."
            )
        new_wallet = round(current_wallet - booking_data.total_amount, 2)
        await users_col.update_one({"_id": current_user.id}, {"$set": {"wallet_balance": new_wallet}})

    # Generate reference code and QR code
    ref_code = generate_booking_ref()
    qr_payload = f"TICKET:{ref_code}|USER:{current_user.email}|SHOW:{booking_data.showtime_id}|SEATS:{','.join(booking_data.seats)}"
    qr_base64 = generate_qr_code_base64(qr_payload)

    now_iso = datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S")

    booking_doc = {
        "booking_reference": ref_code,
        "user_id": current_user.id,
        "user_name": current_user.full_name,
        "user_email": current_user.email,
        "movie_id": booking_data.movie_id,
        "movie_title": booking_data.movie_title,
        "showtime_id": booking_data.showtime_id,
        "theater_name": booking_data.theater_name,
        "show_date": booking_data.show_date,
        "show_time": booking_data.show_time,
        "screen_type": booking_data.screen_type,
        "seats": booking_data.seats,
        "snacks": booking_data.snacks or [],
        "total_amount": booking_data.total_amount,
        "payment_method": booking_data.payment_method,
        "status": "CONFIRMED",
        "booking_time": now_iso,
        "qr_code_data": qr_base64
    }

    res = await bookings_col.insert_one(booking_doc)
    booking_doc["id"] = str(res.inserted_id)

    # Update booked_seats in showtimes collection
    updated_booked = list(booked_seats.union(set(booking_data.seats)))
    await showtimes_col.update_one({"_id": booking_data.showtime_id}, {"$set": {"booked_seats": updated_booked}})

    # Release seat lock
    seat_lock_service.release_seats(booking_data.showtime_id, booking_data.seats, current_user.id)

    return BookingResponse(**booking_doc)

@router.get("/my-bookings", response_model=List[BookingResponse])
async def get_user_bookings(current_user: UserProfile = Depends(get_current_user)):
    db = get_database()
    bookings_col = db["bookings"]

    cursor = bookings_col.find({"user_id": current_user.id})
    bookings = await cursor.to_list(length=100)

    result = []
    for b in bookings:
        b_dict = dict(b)
        b_dict["id"] = str(b_dict["_id"])
        result.append(BookingResponse(**b_dict))

    # Sort newest first
    result.sort(key=lambda x: x.booking_time, reverse=True)
    return result

@router.delete("/{booking_id}/cancel")
async def cancel_booking(
    booking_id: str,
    current_user: UserProfile = Depends(get_current_user)
):
    """
    Cancel an active booking. Returns refund to wallet balance and frees up showtime seats.
    """
    db = get_database()
    bookings_col = db["bookings"]
    showtimes_col = db["showtimes"]
    users_col = db["users"]

    b = await bookings_col.find_one({"_id": booking_id})
    if not b:
        raise HTTPException(status_code=404, detail="Booking record not found")

    if b["user_id"] != current_user.id and current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not authorized to cancel this booking")

    if b["status"] == "CANCELLED":
        return {"message": "Booking is already cancelled"}

    # Update booking status
    await bookings_col.update_one({"_id": booking_id}, {"$set": {"status": "CANCELLED"}})

    # Free up seats in showtime
    st = await showtimes_col.find_one({"_id": b["showtime_id"]})
    if st:
        current_booked = st.get("booked_seats", [])
        new_booked = [s for s in current_booked if s not in b["seats"]]
        await showtimes_col.update_one({"_id": b["showtime_id"]}, {"$set": {"booked_seats": new_booked}})

    # Refund ticket amount to user's wallet
    refund_amount = b.get("total_amount", 0.0)
    if refund_amount > 0:
        target_user_id = b["user_id"]
        user_doc = await users_col.find_one({"_id": target_user_id})
        if user_doc:
            curr_bal = float(user_doc.get("wallet_balance", 1500.0))
            new_bal = round(curr_bal + refund_amount, 2)
            await users_col.update_one({"_id": target_user_id}, {"$set": {"wallet_balance": new_bal}})

    return {"message": f"Booking cancelled successfully. ₹{refund_amount:,.2f} refunded to your wallet!", "booking_id": booking_id}
