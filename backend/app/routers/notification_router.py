from fastapi import APIRouter, Depends
from motor.motor_asyncio import AsyncIOMotorDatabase
from app.dependencies.auth import get_db, get_current_user
from app.repositories.notification_repo import NotificationRepository
from app.services.notification_service import NotificationService
from app.schemas.notification_schema import NotificationResponse
from typing import List

router = APIRouter(prefix="/api/notifications", tags=["Notifications"])


def _get_service(db: AsyncIOMotorDatabase) -> NotificationService:
    return NotificationService(NotificationRepository(db))


@router.get("/", response_model=List[NotificationResponse])
async def get_notifications(
    current_user: dict = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_db),
):
    """Get current user's notifications."""
    service = _get_service(db)
    return await service.get_user_notifications(current_user["_id"])


@router.post("/{notif_id}/read")
async def mark_read(
    notif_id: str,
    current_user: dict = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_db),
):
    """Mark a notification as read."""
    service = _get_service(db)
    return await service.mark_read(notif_id)


@router.post("/read-all")
async def mark_all_read(
    current_user: dict = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_db),
):
    """Mark all notifications as read."""
    service = _get_service(db)
    return await service.mark_all_read(current_user["_id"])
