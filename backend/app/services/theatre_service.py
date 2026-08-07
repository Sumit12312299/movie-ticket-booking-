from fastapi import HTTPException
from app.repositories.theatre_repo import TheatreRepository, ScreenRepository
from app.schemas.theatre_schema import TheatreCreate, TheatreUpdate, ScreenCreate


class TheatreService:
    """Business logic for theatre and screen management."""

    def __init__(self, theatre_repo: TheatreRepository, screen_repo: ScreenRepository):
        self.theatre_repo = theatre_repo
        self.screen_repo = screen_repo

    # ---- Theatre ----

    async def create_theatre(self, data: TheatreCreate) -> dict:
        theatre = await self.theatre_repo.create(data.model_dump())
        return self._format_theatre(theatre)

    async def get_theatre(self, theatre_id: str) -> dict:
        theatre = await self.theatre_repo.find_by_id(theatre_id)
        if not theatre:
            raise HTTPException(status_code=404, detail="Theatre not found")
        return self._format_theatre(theatre)

    async def list_theatres(self) -> list:
        theatres = await self.theatre_repo.find_all()
        return [self._format_theatre(t) for t in theatres]

    async def update_theatre(self, theatre_id: str, data: TheatreUpdate) -> dict:
        update_data = data.model_dump(exclude_unset=True)
        theatre = await self.theatre_repo.update(theatre_id, update_data)
        if not theatre:
            raise HTTPException(status_code=404, detail="Theatre not found")
        return self._format_theatre(theatre)

    async def delete_theatre(self, theatre_id: str) -> dict:
        deleted = await self.theatre_repo.delete(theatre_id)
        if not deleted:
            raise HTTPException(status_code=404, detail="Theatre not found")
        return {"message": "Theatre deleted successfully"}

    # ---- Screen ----

    async def create_screen(self, data: ScreenCreate) -> dict:
        theatre = await self.theatre_repo.find_by_id(data.theatre_id)
        if not theatre:
            raise HTTPException(status_code=404, detail="Theatre not found")

        screen_data = {
            "theatre_id": data.theatre_id,
            "screen_number": data.screen_number,
            "total_rows": data.total_rows,
            "seats_per_row": data.seats_per_row,
            "seat_capacity": data.total_rows * data.seats_per_row,
        }
        screen = await self.screen_repo.create(screen_data)
        return self._format_screen(screen)

    async def get_screens_by_theatre(self, theatre_id: str) -> list:
        screens = await self.screen_repo.find_by_theatre(theatre_id)
        return [self._format_screen(s) for s in screens]

    async def delete_screen(self, screen_id: str) -> dict:
        deleted = await self.screen_repo.delete(screen_id)
        if not deleted:
            raise HTTPException(status_code=404, detail="Screen not found")
        return {"message": "Screen deleted successfully"}

    def _format_theatre(self, t: dict) -> dict:
        return {
            "id": t["_id"],
            "name": t["name"],
            "location": t["location"],
            "total_screens": t["total_screens"],
            "created_at": t.get("created_at"),
        }

    def _format_screen(self, s: dict) -> dict:
        return {
            "id": s["_id"],
            "theatre_id": s["theatre_id"],
            "screen_number": s["screen_number"],
            "total_rows": s["total_rows"],
            "seats_per_row": s["seats_per_row"],
            "seat_capacity": s["seat_capacity"],
        }
