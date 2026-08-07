from fastapi import HTTPException
from app.repositories.review_repo import ReviewRepository
from app.schemas.review_schema import ReviewCreate


class ReviewService:
    """Business logic for movie reviews."""

    def __init__(self, review_repo: ReviewRepository):
        self.review_repo = review_repo

    async def create_review(self, user_id: str, user_name: str, data: ReviewCreate) -> dict:
        existing = await self.review_repo.find_by_user_and_movie(user_id, data.movie_id)
        if existing:
            raise HTTPException(status_code=400, detail="You have already reviewed this movie")

        review_data = {
            "user_id": user_id,
            "user_name": user_name,
            "movie_id": data.movie_id,
            "rating": data.rating,
            "comment": data.comment,
        }
        review = await self.review_repo.create(review_data)
        return self._format(review)

    async def get_movie_reviews(self, movie_id: str) -> dict:
        reviews = await self.review_repo.find_by_movie(movie_id)
        avg_rating = await self.review_repo.get_average_rating(movie_id)
        return {
            "average_rating": avg_rating,
            "total_reviews": len(reviews),
            "reviews": [self._format(r) for r in reviews],
        }

    def _format(self, r: dict) -> dict:
        return {
            "id": r["_id"],
            "user_id": r["user_id"],
            "user_name": r["user_name"],
            "movie_id": r["movie_id"],
            "rating": r["rating"],
            "comment": r["comment"],
            "created_at": r["created_at"],
        }
