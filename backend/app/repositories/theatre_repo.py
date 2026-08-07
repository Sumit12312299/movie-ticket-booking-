from motor.motor_asyncio import AsyncIOMotorDatabase
from bson import ObjectId
from datetime import datetime, timezone
from typing import Optional


class TheatreRepository:
    """Data access layer for the Theatres collection."""

    def __init__(self, db: AsyncIOMotorDatabase):
        self.collection = db["theatres"]

    async def create(self, theatre_data: dict) -> dict:
        theatre_data["created_at"] = datetime.now(timezone.utc)
        result = await self.collection.insert_one(theatre_data)
        return await self.find_by_id(str(result.inserted_id))

    async def find_by_id(self, theatre_id: str) -> Optional[dict]:
        theatre = await self.collection.find_one({"_id": ObjectId(theatre_id)})
        if theatre:
            theatre["_id"] = str(theatre["_id"])
        return theatre

    async def find_all(self, skip: int = 0, limit: int = 50) -> list:
        theatres = []
        cursor = self.collection.find().skip(skip).limit(limit)
        async for theatre in cursor:
            theatre["_id"] = str(theatre["_id"])
            theatres.append(theatre)
        return theatres

    async def update(self, theatre_id: str, update_data: dict) -> Optional[dict]:
        await self.collection.update_one(
            {"_id": ObjectId(theatre_id)},
            {"$set": update_data},
        )
        return await self.find_by_id(theatre_id)

    async def delete(self, theatre_id: str) -> bool:
        result = await self.collection.delete_one({"_id": ObjectId(theatre_id)})
        return result.deleted_count > 0

    async def count(self) -> int:
        return await self.collection.count_documents({})


class ScreenRepository:
    """Data access layer for the Screens collection."""

    def __init__(self, db: AsyncIOMotorDatabase):
        self.collection = db["screens"]

    async def create(self, screen_data: dict) -> dict:
        result = await self.collection.insert_one(screen_data)
        return await self.find_by_id(str(result.inserted_id))

    async def find_by_id(self, screen_id: str) -> Optional[dict]:
        screen = await self.collection.find_one({"_id": ObjectId(screen_id)})
        if screen:
            screen["_id"] = str(screen["_id"])
        return screen

    async def find_by_theatre(self, theatre_id: str) -> list:
        screens = []
        cursor = self.collection.find({"theatre_id": theatre_id})
        async for screen in cursor:
            screen["_id"] = str(screen["_id"])
            screens.append(screen)
        return screens

    async def update(self, screen_id: str, update_data: dict) -> Optional[dict]:
        await self.collection.update_one(
            {"_id": ObjectId(screen_id)},
            {"$set": update_data},
        )
        return await self.find_by_id(screen_id)

    async def delete(self, screen_id: str) -> bool:
        result = await self.collection.delete_one({"_id": ObjectId(screen_id)})
        return result.deleted_count > 0
