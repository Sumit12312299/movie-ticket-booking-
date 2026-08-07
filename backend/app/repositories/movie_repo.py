from motor.motor_asyncio import AsyncIOMotorDatabase
from bson import ObjectId
from datetime import datetime, timezone
from typing import Optional, List
import re


class MovieRepository:
    """Data access layer for the Movies collection."""

    def __init__(self, db: AsyncIOMotorDatabase):
        self.collection = db["movies"]

    async def create(self, movie_data: dict) -> dict:
        movie_data["created_at"] = datetime.now(timezone.utc)
        result = await self.collection.insert_one(movie_data)
        return await self.find_by_id(str(result.inserted_id))

    async def find_by_id(self, movie_id: str) -> Optional[dict]:
        movie = await self.collection.find_one({"_id": ObjectId(movie_id)})
        if movie:
            movie["_id"] = str(movie["_id"])
        return movie

    async def find_all(self, skip: int = 0, limit: int = 50, active_only: bool = True) -> list:
        query = {"is_active": True} if active_only else {}
        movies = []
        cursor = self.collection.find(query).sort("release_date", -1).skip(skip).limit(limit)
        async for movie in cursor:
            movie["_id"] = str(movie["_id"])
            movies.append(movie)
        return movies

    async def search(self, keyword: str, genre: Optional[str] = None, language: Optional[str] = None) -> list:
        query: dict = {"is_active": True}
        if keyword:
            query["title"] = {"$regex": re.escape(keyword), "$options": "i"}
        if genre:
            query["genre"] = {"$in": [genre]}
        if language:
            query["language"] = {"$regex": re.escape(language), "$options": "i"}

        movies = []
        cursor = self.collection.find(query).sort("release_date", -1)
        async for movie in cursor:
            movie["_id"] = str(movie["_id"])
            movies.append(movie)
        return movies

    async def update(self, movie_id: str, update_data: dict) -> Optional[dict]:
        await self.collection.update_one(
            {"_id": ObjectId(movie_id)},
            {"$set": update_data},
        )
        return await self.find_by_id(movie_id)

    async def delete(self, movie_id: str) -> bool:
        result = await self.collection.delete_one({"_id": ObjectId(movie_id)})
        return result.deleted_count > 0

    async def count(self, active_only: bool = True) -> int:
        query = {"is_active": True} if active_only else {}
        return await self.collection.count_documents(query)
