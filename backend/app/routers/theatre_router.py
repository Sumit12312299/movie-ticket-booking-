from fastapi import APIRouter, Depends, Query, Path
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


@router.get("/", response_model=List[TheatreResponse], summary="List All Theatres")
async def list_theatres(db: AsyncIOMotorDatabase = Depends(get_db)):
    """Retrieve the full list of active cinema halls and multiplexes."""
    service = _get_service(db)
    return await service.list_theatres()


@router.get("/{theatre_id}", response_model=TheatreResponse, summary="Get Theatre Details")
async def get_theatre(
    theatre_id: str = Path(..., description="Unique MongoDB identifier of the theatre"),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Retrieve detailed information and contact metadata for a single theatre."""
    service = _get_service(db)
    return await service.get_theatre(theatre_id)


@router.post("/", response_model=TheatreResponse, status_code=201, summary="Register Theatre (Admin)")
async def create_theatre(
    data: TheatreCreate,
    db: AsyncIOMotorDatabase = Depends(get_db),
    admin: dict = Depends(get_current_admin),
):
    """Create a new theatre partner facility in the booking network (Admin only)."""
    service = _get_service(db)
    return await service.create_theatre(data)


@router.put("/{theatre_id}", response_model=TheatreResponse, summary="Update Theatre (Admin)")
async def update_theatre(
    theatre_id: str = Path(..., description="Unique theatre ID to update"),
    data: TheatreUpdate = ...,
    db: AsyncIOMotorDatabase = Depends(get_db),
    admin: dict = Depends(get_current_admin),
):
    """Update theatre facilities, contact info, or operational status (Admin only)."""
    service = _get_service(db)
    return await service.update_theatre(theatre_id, data)


@router.delete("/{theatre_id}", summary="Delete Theatre (Admin)")
async def delete_theatre(
    theatre_id: str = Path(..., description="Unique theatre ID to delete"),
    db: AsyncIOMotorDatabase = Depends(get_db),
    admin: dict = Depends(get_current_admin),
):
    """Remove a theatre and its associated screens from the network (Admin only)."""
    service = _get_service(db)
    return await service.delete_theatre(theatre_id)


# ---- Screens ----

@router.get("/{theatre_id}/screens", response_model=List[ScreenResponse], summary="List Theatre Screens")
async def list_screens(
    theatre_id: str = Path(..., description="Theatre ID to fetch screens for"),
    db: AsyncIOMotorDatabase = Depends(get_db),
):
    """Fetch all auditorium screens and seat matrix configurations for a specific theatre."""
    service = _get_service(db)
    return await service.get_screens_by_theatre(theatre_id)


@router.post("/screens", response_model=ScreenResponse, status_code=201, summary="Create Screen (Admin)")
async def create_screen(
    data: ScreenCreate,
    db: AsyncIOMotorDatabase = Depends(get_db),
    admin: dict = Depends(get_current_admin),
):
    """Add a new auditorium screen with seating capacities to a theatre (Admin only)."""
    service = _get_service(db)
    return await service.create_screen(data)


@router.delete("/screens/{screen_id}", summary="Delete Screen (Admin)")
async def delete_screen(
    screen_id: str = Path(..., description="Screen ID to remove"),
    db: AsyncIOMotorDatabase = Depends(get_db),
    admin: dict = Depends(get_current_admin),
):
    """Remove an auditorium screen from a theatre (Admin only)."""
    service = _get_service(db)
    return await service.delete_screen(screen_id)
