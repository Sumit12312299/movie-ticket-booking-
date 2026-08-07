from fastapi import APIRouter, Depends
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


@router.get("/movie/{movie_id}", response_model=List[ShowResponse])
async def list_shows_by_movie(
    movie_id: str,
    db: AsyncIOMotorDatabase = Depends(get_db),
):
    """List all shows for a movie (public)."""
    service = _get_service(db)
    return await service.list_shows_by_movie(movie_id)


@router.get("/all", response_model=List[ShowResponse])
async def list_all_shows(
    db: AsyncIOMotorDatabase = Depends(get_db),
    admin: dict = Depends(get_current_admin),
):
    """List all shows (Admin only)."""
    service = _get_service(db)
    return await service.list_all_shows()


@router.get("/{show_id}", response_model=ShowResponse)
async def get_show(show_id: str, db: AsyncIOMotorDatabase = Depends(get_db)):
    """Get show summary by ID (public)."""
    service = _get_service(db)
    return await service.get_show(show_id)


@router.get("/{show_id}/seats", response_model=ShowDetailResponse)
async def get_show_seats(show_id: str, db: AsyncIOMotorDatabase = Depends(get_db)):
    """Get show with full seat layout for booking (public)."""
    service = _get_service(db)
    return await service.get_show_detail(show_id)


@router.post("/", response_model=ShowResponse, status_code=201)
async def create_show(
    data: ShowCreate,
    db: AsyncIOMotorDatabase = Depends(get_db),
    admin: dict = Depends(get_current_admin),
):
    """Create a new show (Admin only)."""
    service = _get_service(db)
    return await service.create_show(data)


@router.put("/{show_id}", response_model=ShowResponse)
async def update_show(
    show_id: str,
    data: ShowUpdate,
    db: AsyncIOMotorDatabase = Depends(get_db),
    admin: dict = Depends(get_current_admin),
):
    """Update a show (Admin only)."""
    service = _get_service(db)
    return await service.update_show(show_id, data)


@router.delete("/{show_id}")
async def delete_show(
    show_id: str,
    db: AsyncIOMotorDatabase = Depends(get_db),
    admin: dict = Depends(get_current_admin),
):
    """Delete a show (Admin only)."""
    service = _get_service(db)
    return await service.delete_show(show_id)
