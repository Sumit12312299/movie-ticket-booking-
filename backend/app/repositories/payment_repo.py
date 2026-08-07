from motor.motor_asyncio import AsyncIOMotorDatabase
from bson import ObjectId
from datetime import datetime, timezone
from typing import Optional
import uuid


class PaymentRepository:
    """Data access layer for the Payments collection."""

    def __init__(self, db: AsyncIOMotorDatabase):
        self.collection = db["payments"]

    async def create(self, payment_data: dict) -> dict:
        payment_data["payment_time"] = datetime.now(timezone.utc)
        payment_data["transaction_id"] = f"TXN-{uuid.uuid4().hex[:12].upper()}"
        payment_data["status"] = "success"
        result = await self.collection.insert_one(payment_data)
        return await self.find_by_id(str(result.inserted_id))

    async def find_by_id(self, payment_id: str) -> Optional[dict]:
        payment = await self.collection.find_one({"_id": ObjectId(payment_id)})
        if payment:
            payment["_id"] = str(payment["_id"])
        return payment

    async def find_by_booking(self, booking_id: str) -> Optional[dict]:
        payment = await self.collection.find_one({"booking_id": booking_id})
        if payment:
            payment["_id"] = str(payment["_id"])
        return payment

    async def find_by_user(self, user_id: str) -> list:
        payments = []
        cursor = self.collection.find({"user_id": user_id}).sort("payment_time", -1)
        async for payment in cursor:
            payment["_id"] = str(payment["_id"])
            payments.append(payment)
        return payments

    async def refund(self, payment_id: str) -> Optional[dict]:
        await self.collection.update_one(
            {"_id": ObjectId(payment_id)},
            {"$set": {"status": "refunded"}},
        )
        return await self.find_by_id(payment_id)
