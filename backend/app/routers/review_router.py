from fastapi import APIRouter, Depends
from motor.motor_asyncio import AsyncIOMotorDatabase
from app.dependencies.auth import get_db, get_current_user
from app.repositories.review_repo import ReviewRepository
from app.services.review_service import ReviewService
from app.schemas.review_schema import ReviewCreate, ReviewResponse
from typing import List

router = APIRouter(prefix="/api/reviews", tags=["Reviews"])


def _get_service(db: AsyncIOMotorDatabase) -> ReviewService:
    return ReviewService(ReviewRepository(db))


@router.post("/", response_model=ReviewResponse, status_code=201)
async def create_review(
    data: ReviewCreate,
    current_user: dict = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_db),
):
    """Submit a review for a movie."""
    service = _get_service(db)
    return await service.create_review(current_user["_id"], current_user["name"], data)


@router.get("/movie/{movie_id}")
async def get_movie_reviews(
    movie_id: str,
    db: AsyncIOMotorDatabase = Depends(get_db),
):
    """Get all reviews for a movie (public)."""
    service = _get_service(db)
    return await service.get_movie_reviews(movie_id)
