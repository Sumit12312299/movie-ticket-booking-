from motor.motor_asyncio import AsyncIOMotorDatabase
from bson import ObjectId
from datetime import datetime, timezone
from typing import Optional


class NotificationRepository:
    """Data access layer for the Notifications collection."""

    def __init__(self, db: AsyncIOMotorDatabase):
        self.collection = db["notifications"]

    async def create(self, notif_data: dict) -> dict:
        notif_data["created_at"] = datetime.now(timezone.utc)
        notif_data["is_read"] = False
        result = await self.collection.insert_one(notif_data)
        return await self.find_by_id(str(result.inserted_id))

    async def find_by_id(self, notif_id: str) -> Optional[dict]:
        notif = await self.collection.find_one({"_id": ObjectId(notif_id)})
        if notif:
            notif["_id"] = str(notif["_id"])
        return notif

    async def find_by_user(self, user_id: str) -> list:
        notifs = []
        cursor = self.collection.find({"user_id": user_id}).sort("created_at", -1).limit(50)
        async for n in cursor:
            n["_id"] = str(n["_id"])
            notifs.append(n)
        return notifs

    async def mark_read(self, notif_id: str) -> Optional[dict]:
        await self.collection.update_one(
            {"_id": ObjectId(notif_id)},
            {"$set": {"is_read": True}},
        )
        return await self.find_by_id(notif_id)

    async def mark_all_read(self, user_id: str) -> int:
        result = await self.collection.update_many(
            {"user_id": user_id, "is_read": False},
            {"$set": {"is_read": True}},
        )
        return result.modified_count
