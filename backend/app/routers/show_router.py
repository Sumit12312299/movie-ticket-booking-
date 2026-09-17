from fastapi import APIRouter, Depends, Path
from motor.motor_asyncio import AsyncIOMotorDatabase
from app.dependencies.auth import get_db, get_current_admin
from app.repositories.show_repo import ShowRepository
from app.repositories.theatre_repo import TheatreRepository, ScreenRepository
from app.repositories.movie_repo import MovieRepository
from app.services.show_service import ShowService
from app.schemas.show_schema import ShowCreate, ShowUpdate, ShowResponse, ShowDetailResponse
from typing import List

router = APIRouter(prefix="/api/shows", tags=["Shows"])


def _get_service(db: AsyncIOMotorDatabase) -> ShowService:
    return ShowService(
        ShowRepository(db),
        ScreenRepository(db),
        MovieRepository(db),
        TheatreRepository(db),
    )


@router.get("/movie/{movie_id}", response_model=List[ShowResponse], summary="List Shows for Movie")
async def list_shows_by_movie(
    movie_id: str = Path(..., description="Movie identifier to fetch showtimes for"),
    db: AsyncIOMotorDatabase = Depends(get_db),
):
    """Retrieve all upcoming scheduled showtimes across all theatres for a specific movie."""
    service = _get_service(db)
    return await service.list_shows_by_movie(movie_id)


@router.get("/all", response_model=List[ShowResponse], summary="List All Shows (Admin)")
async def list_all_shows(
    db: AsyncIOMotorDatabase = Depends(get_db),
    admin: dict = Depends(get_current_admin),
):
    """List all scheduled screenings across all cinema auditoriums (Admin only)."""
    service = _get_service(db)
    return await service.list_all_shows()


@router.get("/{show_id}", response_model=ShowResponse, summary="Get Show Summary")
async def get_show(
    show_id: str = Path(..., description="Unique showtime identifier"),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Fetch show metadata, start time, theatre, and pricing overview."""
    service = _get_service(db)
    return await service.get_show(show_id)


@router.get("/{show_id}/seats", response_model=ShowDetailResponse, summary="Get Show Seat Matrix")
async def get_show_seats(
    show_id: str = Path(..., description="Show ID to fetch live seat grid for"),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Fetch full interactive seat grid with real-time reservation availability for customer booking."""
    service = _get_service(db)
    return await service.get_show_detail(show_id)


@router.post("/", response_model=ShowResponse, status_code=201, summary="Schedule Show (Admin)")
async def create_show(
    data: ShowCreate,
    db: AsyncIOMotorDatabase = Depends(get_db),
    admin: dict = Depends(get_current_admin),
):
    """Schedule a new movie screening for an auditorium screen with price tiers (Admin only)."""
    service = _get_service(db)
    return await service.create_show(data)


@router.put("/{show_id}", response_model=ShowResponse, summary="Update Show (Admin)")
async def update_show(
    show_id: str = Path(..., description="Show ID to update"),
    data: ShowUpdate = ...,
    db: AsyncIOMotorDatabase = Depends(get_db),
    admin: dict = Depends(get_current_admin),
):
    """Update show timing, status, or pricing parameters (Admin only)."""
    service = _get_service(db)
    return await service.update_show(show_id, data)


@router.delete("/{show_id}", summary="Cancel Show (Admin)")
async def delete_show(
    show_id: str = Path(..., description="Show ID to cancel"),
    db: AsyncIOMotorDatabase = Depends(get_db),
    admin: dict = Depends(get_current_admin),
):
    """Cancel a scheduled showtime and clean up seat locks (Admin only)."""
    service = _get_service(db)
    return await service.delete_show(show_id)
