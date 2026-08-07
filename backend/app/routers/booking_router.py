from fastapi import APIRouter, Depends
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


@router.post("/", response_model=BookingResponse, status_code=201)
async def create_booking(
    data: BookingCreate,
    current_user: dict = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_db),
):
    """Book tickets for a show (Customer)."""
    service = _get_service(db)
    return await service.create_booking(current_user["_id"], data)


@router.get("/me", response_model=List[BookingResponse])
async def get_my_bookings(
    current_user: dict = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_db),
):
    """Get current user's booking history."""
    service = _get_service(db)
    return await service.get_user_bookings(current_user["_id"])


@router.get("/all", response_model=List[BookingResponse])
async def get_all_bookings(
    db: AsyncIOMotorDatabase = Depends(get_db),
    admin: dict = Depends(get_current_admin),
):
    """Get all bookings (Admin only)."""
    service = _get_service(db)
    return await service.get_all_bookings()


@router.post("/{booking_id}/cancel", response_model=BookingResponse)
async def cancel_booking(
    booking_id: str,
    current_user: dict = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_db),
):
    """Cancel a booking."""
    service = _get_service(db)
    return await service.cancel_booking(booking_id, current_user["_id"])


@router.get("/revenue")
async def get_revenue(
    db: AsyncIOMotorDatabase = Depends(get_db),
    admin: dict = Depends(get_current_admin),
):
    """Get revenue statistics (Admin only)."""
    service = _get_service(db)
    return await service.get_revenue()
