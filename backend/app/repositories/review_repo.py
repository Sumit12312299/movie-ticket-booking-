from motor.motor_asyncio import AsyncIOMotorDatabase
from bson import ObjectId
from datetime import datetime, timezone
from typing import Optional


class ReviewRepository:
    """Data access layer for the Reviews collection."""

    def __init__(self, db: AsyncIOMotorDatabase):
        self.collection = db["reviews"]

    async def create(self, review_data: dict) -> dict:
        review_data["created_at"] = datetime.now(timezone.utc)
        result = await self.collection.insert_one(review_data)
        return await self.find_by_id(str(result.inserted_id))

    async def find_by_id(self, review_id: str) -> Optional[dict]:
        review = await self.collection.find_one({"_id": ObjectId(review_id)})
        if review:
            review["_id"] = str(review["_id"])
        return review

    async def find_by_movie(self, movie_id: str) -> list:
        reviews = []
        cursor = self.collection.find({"movie_id": movie_id}).sort("created_at", -1)
        async for review in cursor:
            review["_id"] = str(review["_id"])
            reviews.append(review)
        return reviews

    async def find_by_user_and_movie(self, user_id: str, movie_id: str) -> Optional[dict]:
        review = await self.collection.find_one({"user_id": user_id, "movie_id": movie_id})
        if review:
            review["_id"] = str(review["_id"])
        return review

    async def get_average_rating(self, movie_id: str) -> float:
        pipeline = [
            {"$match": {"movie_id": movie_id}},
            {"$group": {"_id": None, "avg": {"$avg": "$rating"}}},
        ]
        result = await self.collection.aggregate(pipeline).to_list(1)
        return round(result[0]["avg"], 1) if result else 0.0
