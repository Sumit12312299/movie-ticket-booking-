from motor.motor_asyncio import AsyncIOMotorDatabase
from bson import ObjectId
from datetime import datetime, timezone
from typing import Optional, List


class ShowRepository:
    """Data access layer for the Shows collection."""

    def __init__(self, db: AsyncIOMotorDatabase):
        self.collection = db["shows"]

    async def create(self, show_data: dict) -> dict:
        show_data["created_at"] = datetime.now(timezone.utc)
        result = await self.collection.insert_one(show_data)
        return await self.find_by_id(str(result.inserted_id))

    async def find_by_id(self, show_id: str) -> Optional[dict]:
        show = await self.collection.find_one({"_id": ObjectId(show_id)})
        if show:
            show["_id"] = str(show["_id"])
        return show

    async def find_by_movie(self, movie_id: str) -> list:
        shows = []
        cursor = self.collection.find({"movie_id": movie_id}).sort("show_time", 1)
        async for show in cursor:
            show["_id"] = str(show["_id"])
            shows.append(show)
        return shows

    async def find_all(self, skip: int = 0, limit: int = 100) -> list:
        shows = []
        cursor = self.collection.find().sort("show_time", 1).skip(skip).limit(limit)
        async for show in cursor:
            show["_id"] = str(show["_id"])
            shows.append(show)
        return shows

    async def update(self, show_id: str, update_data: dict) -> Optional[dict]:
        await self.collection.update_one(
            {"_id": ObjectId(show_id)},
            {"$set": update_data},
        )
        return await self.find_by_id(show_id)

    async def update_seat_status(self, show_id: str, seat_labels: List[str], status: str) -> bool:
        """Update the status of specific seats in a show's seat layout."""
        show = await self.find_by_id(show_id)
        if not show:
            return False

        seat_layout = show.get("seat_layout", [])
        booked_count = 0
        for seat in seat_layout:
            label = f"{seat['row']}{seat['number']}"
            if label in seat_labels:
                seat["status"] = status
                booked_count += 1

        delta = booked_count if status == "available" else -booked_count
        await self.collection.update_one(
            {"_id": ObjectId(show_id)},
            {
                "$set": {"seat_layout": seat_layout},
                "$inc": {"available_seats": delta},
            },
        )
        return True

    async def delete(self, show_id: str) -> bool:
        result = await self.collection.delete_one({"_id": ObjectId(show_id)})
        return result.deleted_count > 0

    async def count(self) -> int:
        return await self.collection.count_documents({})
