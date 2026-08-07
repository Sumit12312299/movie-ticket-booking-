from motor.motor_asyncio import AsyncIOMotorDatabase
from bson import ObjectId
from datetime import datetime, timezone
from typing import Optional, Dict, Any


class UserRepository:
    """Data access layer for the Users collection."""

    def __init__(self, db: AsyncIOMotorDatabase):
        self.collection = db["users"]

    async def create(self, user_data: dict) -> dict:
        user_data["created_at"] = datetime.now(timezone.utc)
        user_data["updated_at"] = datetime.now(timezone.utc)
        result = await self.collection.insert_one(user_data)
        return await self.find_by_id(str(result.inserted_id))

    async def find_by_id(self, user_id: str) -> Optional[dict]:
        user = await self.collection.find_one({"_id": ObjectId(user_id)})
        if user:
            user["_id"] = str(user["_id"])
        return user

    async def find_by_email(self, email: str) -> Optional[dict]:
        user = await self.collection.find_one({"email": email})
        if user:
            user["_id"] = str(user["_id"])
        return user

    async def update(self, user_id: str, update_data: dict) -> Optional[dict]:
        update_data["updated_at"] = datetime.now(timezone.utc)
        await self.collection.update_one(
            {"_id": ObjectId(user_id)},
            {"$set": update_data},
        )
        return await self.find_by_id(user_id)

    async def find_all(self, skip: int = 0, limit: int = 100) -> list:
        users = []
        cursor = self.collection.find().skip(skip).limit(limit)
        async for user in cursor:
            user["_id"] = str(user["_id"])
            users.append(user)
        return users

    async def count(self) -> int:
        return await self.collection.count_documents({})
