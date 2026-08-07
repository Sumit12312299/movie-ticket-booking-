from motor.motor_asyncio import AsyncIOMotorDatabase
from bson import ObjectId
from datetime import datetime, timezone
from typing import Optional


class BookingRepository:
    """Data access layer for the Bookings collection."""

    def __init__(self, db: AsyncIOMotorDatabase):
        self.collection = db["bookings"]

    async def create(self, booking_data: dict) -> dict:
        booking_data["booking_time"] = datetime.now(timezone.utc)
        booking_data["status"] = "confirmed"
        result = await self.collection.insert_one(booking_data)
        return await self.find_by_id(str(result.inserted_id))

    async def find_by_id(self, booking_id: str) -> Optional[dict]:
        booking = await self.collection.find_one({"_id": ObjectId(booking_id)})
        if booking:
            booking["_id"] = str(booking["_id"])
        return booking

    async def find_by_user(self, user_id: str) -> list:
        bookings = []
        cursor = self.collection.find({"user_id": user_id}).sort("booking_time", -1)
        async for booking in cursor:
            booking["_id"] = str(booking["_id"])
            bookings.append(booking)
        return bookings

    async def find_all(self, skip: int = 0, limit: int = 100) -> list:
        bookings = []
        cursor = self.collection.find().sort("booking_time", -1).skip(skip).limit(limit)
        async for booking in cursor:
            booking["_id"] = str(booking["_id"])
            bookings.append(booking)
        return bookings

    async def cancel(self, booking_id: str) -> Optional[dict]:
        await self.collection.update_one(
            {"_id": ObjectId(booking_id)},
            {"$set": {"status": "cancelled"}},
        )
        return await self.find_by_id(booking_id)

    async def count(self, status: Optional[str] = None) -> int:
        query = {}
        if status:
            query["status"] = status
        return await self.collection.count_documents(query)

    async def get_total_revenue(self) -> float:
        pipeline = [
            {"$match": {"status": "confirmed"}},
            {"$group": {"_id": None, "total": {"$sum": "$total_amount"}}},
        ]
        result = await self.collection.aggregate(pipeline).to_list(1)
        return result[0]["total"] if result else 0.0

    async def get_revenue_by_movie(self) -> list:
        pipeline = [
            {"$match": {"status": "confirmed"}},
            {"$group": {
                "_id": "$movie_title",
                "total_revenue": {"$sum": "$total_amount"},
                "total_bookings": {"$sum": 1},
            }},
            {"$sort": {"total_revenue": -1}},
        ]
        return await self.collection.aggregate(pipeline).to_list(50)
