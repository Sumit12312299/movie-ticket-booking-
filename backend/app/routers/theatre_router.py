from fastapi import APIRouter, Depends
from motor.motor_asyncio import AsyncIOMotorDatabase
from app.dependencies.auth import get_db, get_current_admin
from app.repositories.theatre_repo import TheatreRepository, ScreenRepository
from app.services.theatre_service import TheatreService
from app.schemas.theatre_schema import (
    TheatreCreate, TheatreUpdate, TheatreResponse,
    ScreenCreate, ScreenResponse,
)
from typing import List

router = APIRouter(prefix="/api/theatres", tags=["Theatres"])


def _get_service(db: AsyncIOMotorDatabase) -> TheatreService:
    return TheatreService(TheatreRepository(db), ScreenRepository(db))


@router.get("/", response_model=List[TheatreResponse])
async def list_theatres(db: AsyncIOMotorDatabase = Depends(get_db)):
    """List all theatres (public)."""
    service = _get_service(db)
    return await service.list_theatres()


@router.get("/{theatre_id}", response_model=TheatreResponse)
async def get_theatre(theatre_id: str, db: AsyncIOMotorDatabase = Depends(get_db)):
    """Get a theatre by ID (public)."""
    service = _get_service(db)
    return await service.get_theatre(theatre_id)


@router.post("/", response_model=TheatreResponse, status_code=201)
async def create_theatre(
    data: TheatreCreate,
    db: AsyncIOMotorDatabase = Depends(get_db),
    admin: dict = Depends(get_current_admin),
):
    """Create a new theatre (Admin only)."""
    service = _get_service(db)
    return await service.create_theatre(data)


@router.put("/{theatre_id}", response_model=TheatreResponse)
async def update_theatre(
    theatre_id: str,
    data: TheatreUpdate,
    db: AsyncIOMotorDatabase = Depends(get_db),
    admin: dict = Depends(get_current_admin),
):
    """Update a theatre (Admin only)."""
    service = _get_service(db)
    return await service.update_theatre(theatre_id, data)


@router.delete("/{theatre_id}")
async def delete_theatre(
    theatre_id: str,
    db: AsyncIOMotorDatabase = Depends(get_db),
    admin: dict = Depends(get_current_admin),
):
    """Delete a theatre (Admin only)."""
    service = _get_service(db)
    return await service.delete_theatre(theatre_id)


# ---- Screens ----

@router.get("/{theatre_id}/screens", response_model=List[ScreenResponse])
async def list_screens(
    theatre_id: str,
    db: AsyncIOMotorDatabase = Depends(get_db),
):
    """List all screens for a theatre (public)."""
    service = _get_service(db)
    return await service.get_screens_by_theatre(theatre_id)


@router.post("/screens", response_model=ScreenResponse, status_code=201)
async def create_screen(
    data: ScreenCreate,
    db: AsyncIOMotorDatabase = Depends(get_db),
    admin: dict = Depends(get_current_admin),
):
    """Add a screen to a theatre (Admin only)."""
    service = _get_service(db)
    return await service.create_screen(data)


@router.delete("/screens/{screen_id}")
async def delete_screen(
    screen_id: str,
    db: AsyncIOMotorDatabase = Depends(get_db),
    admin: dict = Depends(get_current_admin),
):
    """Delete a screen (Admin only)."""
    service = _get_service(db)
    return await service.delete_screen(screen_id)
