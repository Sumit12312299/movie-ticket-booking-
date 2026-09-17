from fastapi import APIRouter, Depends
from motor.motor_asyncio import AsyncIOMotorDatabase
from app.dependencies.auth import get_db, get_current_admin
from app.repositories.user_repo import UserRepository
from app.repositories.movie_repo import MovieRepository
from app.repositories.theatre_repo import TheatreRepository
from app.repositories.show_repo import ShowRepository
from app.repositories.booking_repo import BookingRepository
from app.services.admin_service import AdminService

router = APIRouter(prefix="/api/admin", tags=["Admin"])


def _get_service(db: AsyncIOMotorDatabase) -> AdminService:
    return AdminService(
        UserRepository(db),
        MovieRepository(db),
        TheatreRepository(db),
        ShowRepository(db),
        BookingRepository(db),
    )


@router.get("/dashboard", summary="Admin Analytics Dashboard")
async def dashboard(
    db: AsyncIOMotorDatabase = Depends(get_db),
    admin: dict = Depends(get_current_admin),
):
    """Retrieve executive KPIs including total revenue, active tickets, registered users, and active screenings."""
    service = _get_service(db)
    return await service.get_dashboard_stats()


@router.get("/users", summary="List Registered Users")
async def list_users(
    db: AsyncIOMotorDatabase = Depends(get_db),
    admin: dict = Depends(get_current_admin),
):
    """Retrieve full roster of registered user accounts and customer metadata (Admin only)."""
    service = _get_service(db)
    return await service.get_all_users()
