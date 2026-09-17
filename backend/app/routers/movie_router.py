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


@router.get("/", response_model=List[MovieResponse], summary="List Active Movies")
async def list_movies(
    skip: int = Query(0, ge=0, description="Number of movies to skip"),
    limit: int = Query(50, ge=1, le=100, description="Max number of movies to return"),
    db: AsyncIOMotorDatabase = Depends(get_db),
):
    """List all currently active movies available for booking (public endpoint)."""
    service = _get_service(db)
    return await service.list_movies(skip=skip, limit=limit)


@router.get("/search", response_model=List[MovieResponse], summary="Search & Filter Movies")
async def search_movies(
    q: str = Query("", description="Keyword search for title or description"),
    genre: Optional[str] = Query(None, description="Filter by genre"),
    language: Optional[str] = Query(None, description="Filter by language"),
    db: AsyncIOMotorDatabase = Depends(get_db),
):
    """Search movies by title keywords, genre filter, or language (public endpoint)."""
    service = _get_service(db)
    return await service.search_movies(keyword=q, genre=genre, language=language)


@router.get("/all", response_model=List[MovieResponse], summary="List All Movies (Admin)")
async def list_all_movies(
    db: AsyncIOMotorDatabase = Depends(get_db),
    admin: dict = Depends(get_current_admin),
):
    """List all movies including archived or inactive titles (Admin only)."""
    service = _get_service(db)
    return await service.list_movies(active_only=False)


@router.get("/{movie_id}", response_model=MovieResponse, summary="Get Movie by ID")
async def get_movie(movie_id: str, db: AsyncIOMotorDatabase = Depends(get_db)):
    """Retrieve detailed information for a single movie by ID (public endpoint)."""
    service = _get_service(db)
    return await service.get_movie(movie_id)


@router.post("/", response_model=MovieResponse, status_code=201, summary="Create Movie (Admin)")
async def create_movie(
    data: MovieCreate,
    db: AsyncIOMotorDatabase = Depends(get_db),
    admin: dict = Depends(get_current_admin),
):
    """Create a new movie record in the catalog (Admin only)."""
    service = _get_service(db)
    return await service.create_movie(data)


@router.put("/{movie_id}", response_model=MovieResponse, summary="Update Movie (Admin)")
async def update_movie(
    movie_id: str,
    data: MovieUpdate,
    db: AsyncIOMotorDatabase = Depends(get_db),
    admin: dict = Depends(get_current_admin),
):
    """Update movie details or availability status (Admin only)."""
    service = _get_service(db)
    return await service.update_movie(movie_id, data)


@router.delete("/{movie_id}", summary="Delete Movie (Admin)")
async def delete_movie(
    movie_id: str,
    db: AsyncIOMotorDatabase = Depends(get_db),
    admin: dict = Depends(get_current_admin),
):
    """Soft delete or permanently remove a movie (Admin only)."""
    service = _get_service(db)
    return await service.delete_movie(movie_id)
