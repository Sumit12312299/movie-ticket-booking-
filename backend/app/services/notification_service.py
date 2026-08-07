from app.repositories.notification_repo import NotificationRepository


class NotificationService:
    """Business logic for notifications."""

    def __init__(self, notif_repo: NotificationRepository):
        self.notif_repo = notif_repo

    async def get_user_notifications(self, user_id: str) -> list:
        notifs = await self.notif_repo.find_by_user(user_id)
        return [self._format(n) for n in notifs]

    async def mark_read(self, notif_id: str) -> dict:
        notif = await self.notif_repo.mark_read(notif_id)
        return self._format(notif)

    async def mark_all_read(self, user_id: str) -> dict:
        count = await self.notif_repo.mark_all_read(user_id)
        return {"message": f"Marked {count} notifications as read"}

    def _format(self, n: dict) -> dict:
        return {
            "id": n["_id"],
            "user_id": n["user_id"],
            "title": n["title"],
            "message": n["message"],
            "is_read": n["is_read"],
            "created_at": n["created_at"],
        }
