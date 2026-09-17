from fastapi import APIRouter, Depends, Path
from motor.motor_asyncio import AsyncIOMotorDatabase
from app.dependencies.auth import get_db, get_current_user, get_current_admin
from app.repositories.booking_repo import BookingRepository
from app.repositories.show_repo import ShowRepository
from app.repositories.movie_repo import MovieRepository
from app.repositories.theatre_repo import TheatreRepository
from app.services.booking_service import BookingService
from app.schemas.booking_schema import BookingCreate, BookingResponse
from typing import List

router = APIRouter(prefix="/api/bookings", tags=["Bookings"])


def _get_service(db: AsyncIOMotorDatabase) -> BookingService:
    return BookingService(
        BookingRepository(db),
        ShowRepository(db),
        MovieRepository(db),
        TheatreRepository(db),
    )


@router.post("/", response_model=BookingResponse, status_code=201, summary="Create Ticket Reservation")
async def create_booking(
    data: BookingCreate,
    current_user: dict = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_db),
):
    """Reserve selected show seats and initiate ticket order creation for the authenticated customer."""
    service = _get_service(db)
    return await service.create_booking(current_user["_id"], data)


@router.get("/me", response_model=List[BookingResponse], summary="Get Customer Bookings")
async def get_my_bookings(
    current_user: dict = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_db),
):
    """Retrieve full chronological booking history with digital ticket codes for the logged-in user."""
    service = _get_service(db)
    return await service.get_user_bookings(current_user["_id"])


@router.get("/all", response_model=List[BookingResponse], summary="Get All System Bookings (Admin)")
async def get_all_bookings(
    db: AsyncIOMotorDatabase = Depends(get_db),
    admin: dict = Depends(get_current_admin),
):
    """Retrieve system-wide reservation logs and transaction records (Admin only)."""
    service = _get_service(db)
    return await service.get_all_bookings()


@router.post("/{booking_id}/cancel", response_model=BookingResponse, summary="Cancel Reservation")
async def cancel_booking(
    booking_id: str = Path(..., description="Unique booking ID to cancel"),
    current_user: dict = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_db),
):
    """Cancel an active booking, release reserved seats back to the hall, and process refund simulation."""
    service = _get_service(db)
    return await service.cancel_booking(booking_id, current_user["_id"])


@router.get("/revenue", summary="Get Revenue Statistics (Admin)")
async def get_revenue(
    db: AsyncIOMotorDatabase = Depends(get_db),
    admin: dict = Depends(get_current_admin),
):
    """Aggregate total ticket sales revenue, booking counts, and average order values (Admin only)."""
    service = _get_service(db)
    return await service.get_revenue()
