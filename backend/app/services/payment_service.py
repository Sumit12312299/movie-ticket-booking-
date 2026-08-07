from fastapi import HTTPException
from app.repositories.payment_repo import PaymentRepository
from app.repositories.booking_repo import BookingRepository
from app.repositories.notification_repo import NotificationRepository
from app.schemas.payment_schema import PaymentCreate


class PaymentService:
    """Business logic for payment processing."""

    def __init__(self, payment_repo: PaymentRepository, booking_repo: BookingRepository, notif_repo: NotificationRepository):
        self.payment_repo = payment_repo
        self.booking_repo = booking_repo
        self.notif_repo = notif_repo

    async def process_payment(self, user_id: str, data: PaymentCreate) -> dict:
        booking = await self.booking_repo.find_by_id(data.booking_id)
        if not booking:
            raise HTTPException(status_code=404, detail="Booking not found")
        if booking["user_id"] != user_id:
            raise HTTPException(status_code=403, detail="Not authorized")
        if booking["status"] == "cancelled":
            raise HTTPException(status_code=400, detail="Booking is cancelled")

        existing = await self.payment_repo.find_by_booking(data.booking_id)
        if existing and existing["status"] == "success":
            raise HTTPException(status_code=400, detail="Payment already completed")

        payment_data = {
            "booking_id": data.booking_id,
            "user_id": user_id,
            "amount": data.amount,
            "payment_method": data.payment_method,
        }
        payment = await self.payment_repo.create(payment_data)

        # Create notification
        await self.notif_repo.create({
            "user_id": user_id,
            "title": "Payment Successful",
            "message": f"Payment of ₹{data.amount} for booking {data.booking_id[:8]} was successful. Transaction ID: {payment['transaction_id']}",
        })

        return self._format(payment)

    async def get_payment_history(self, user_id: str) -> list:
        payments = await self.payment_repo.find_by_user(user_id)
        return [self._format(p) for p in payments]

    def _format(self, p: dict) -> dict:
        return {
            "id": p["_id"],
            "booking_id": p["booking_id"],
            "user_id": p["user_id"],
            "amount": p["amount"],
            "payment_method": p["payment_method"],
            "status": p["status"],
            "transaction_id": p["transaction_id"],
            "payment_time": p["payment_time"],
        }
