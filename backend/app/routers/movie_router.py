from fastapi import APIRouter, Depends, Query
from motor.motor_asyncio import AsyncIOMotorDatabase
from app.dependencies.auth import get_db, get_current_admin
from app.repositories.movie_repo import MovieRepository
from app.services.movie_service import MovieService
from app.schemas.movie_schema import MovieCreate, MovieUpdate, MovieResponse
from typing import Optional, List

router = APIRouter(prefix="/api/movies", tags=["Movies"])


def _get_service(db: AsyncIOMotorDatabase) -> MovieService:
    return MovieService(MovieRepository(db))


@router.get("/", response_model=List[MovieResponse])
async def list_movies(
    skip: int = 0,
    limit: int = 50,
    db: AsyncIOMotorDatabase = Depends(get_db),
):
    """List all active movies (public)."""
    service = _get_service(db)
    return await service.list_movies(skip=skip, limit=limit)


@router.get("/search", response_model=List[MovieResponse])
async def search_movies(
    q: str = "",
    genre: Optional[str] = None,
    language: Optional[str] = None,
    db: AsyncIOMotorDatabase = Depends(get_db),
):
    """Search movies by title, genre, or language (public)."""
    service = _get_service(db)
    return await service.search_movies(keyword=q, genre=genre, language=language)


@router.get("/all", response_model=List[MovieResponse])
async def list_all_movies(
    db: AsyncIOMotorDatabase = Depends(get_db),
    admin: dict = Depends(get_current_admin),
):
    """List all movies including inactive (Admin only)."""
    service = _get_service(db)
    return await service.list_movies(active_only=False)


@router.get("/{movie_id}", response_model=MovieResponse)
async def get_movie(movie_id: str, db: AsyncIOMotorDatabase = Depends(get_db)):
    """Get a single movie by ID (public)."""
    service = _get_service(db)
    return await service.get_movie(movie_id)


@router.post("/", response_model=MovieResponse, status_code=201)
async def create_movie(
    data: MovieCreate,
    db: AsyncIOMotorDatabase = Depends(get_db),
    admin: dict = Depends(get_current_admin),
):
    """Create a new movie (Admin only)."""
    service = _get_service(db)
    return await service.create_movie(data)


@router.put("/{movie_id}", response_model=MovieResponse)
async def update_movie(
    movie_id: str,
    data: MovieUpdate,
    db: AsyncIOMotorDatabase = Depends(get_db),
    admin: dict = Depends(get_current_admin),
):
    """Update a movie (Admin only)."""
    service = _get_service(db)
    return await service.update_movie(movie_id, data)


@router.delete("/{movie_id}")
async def delete_movie(
    movie_id: str,
    db: AsyncIOMotorDatabase = Depends(get_db),
    admin: dict = Depends(get_current_admin),
):
    """Delete a movie (Admin only)."""
    service = _get_service(db)
    return await service.delete_movie(movie_id)
