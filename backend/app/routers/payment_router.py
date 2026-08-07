from fastapi import APIRouter, Depends
from motor.motor_asyncio import AsyncIOMotorDatabase
from app.dependencies.auth import get_db, get_current_user
from app.repositories.payment_repo import PaymentRepository
from app.repositories.booking_repo import BookingRepository
from app.repositories.notification_repo import NotificationRepository
from app.services.payment_service import PaymentService
from app.schemas.payment_schema import PaymentCreate, PaymentResponse
from typing import List

router = APIRouter(prefix="/api/payments", tags=["Payments"])


def _get_service(db: AsyncIOMotorDatabase) -> PaymentService:
    return PaymentService(PaymentRepository(db), BookingRepository(db), NotificationRepository(db))


@router.post("/", response_model=PaymentResponse, status_code=201)
async def process_payment(
    data: PaymentCreate,
    current_user: dict = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_db),
):
    """Process payment for a booking."""
    service = _get_service(db)
    return await service.process_payment(current_user["_id"], data)


@router.get("/history", response_model=List[PaymentResponse])
async def payment_history(
    current_user: dict = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_db),
):
    """Get current user's payment history."""
    service = _get_service(db)
    return await service.get_payment_history(current_user["_id"])
