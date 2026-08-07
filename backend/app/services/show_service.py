from fastapi import HTTPException
from app.repositories.show_repo import ShowRepository
from app.repositories.theatre_repo import ScreenRepository
from app.repositories.movie_repo import MovieRepository
from app.repositories.theatre_repo import TheatreRepository
from app.schemas.show_schema import ShowCreate, ShowUpdate
import string


class ShowService:
    """Business logic for show management and seat layouts."""

    def __init__(
        self,
        show_repo: ShowRepository,
        screen_repo: ScreenRepository,
        movie_repo: MovieRepository,
        theatre_repo: TheatreRepository,
    ):
        self.show_repo = show_repo
        self.screen_repo = screen_repo
        self.movie_repo = movie_repo
        self.theatre_repo = theatre_repo

    async def create_show(self, data: ShowCreate) -> dict:
        """Create a new show with auto-generated seat layout from screen configuration."""
        movie = await self.movie_repo.find_by_id(data.movie_id)
        if not movie:
            raise HTTPException(status_code=404, detail="Movie not found")

        theatre = await self.theatre_repo.find_by_id(data.theatre_id)
        if not theatre:
            raise HTTPException(status_code=404, detail="Theatre not found")

        screen = await self.screen_repo.find_by_id(data.screen_id)
        if not screen:
            raise HTTPException(status_code=404, detail="Screen not found")

        # Generate seat layout based on screen config
        seat_layout = self._generate_seat_layout(screen["total_rows"], screen["seats_per_row"])
        total_seats = screen["seat_capacity"]

        show_data = {
            "movie_id": data.movie_id,
            "theatre_id": data.theatre_id,
            "screen_id": data.screen_id,
            "show_time": data.show_time,
            "price": data.price,
            "seat_layout": seat_layout,
            "total_seats": total_seats,
            "available_seats": total_seats,
        }

        show = await self.show_repo.create(show_data)
        return await self._enrich_show(show)

    async def get_show(self, show_id: str) -> dict:
        show = await self.show_repo.find_by_id(show_id)
        if not show:
            raise HTTPException(status_code=404, detail="Show not found")
        return await self._enrich_show(show)

    async def get_show_detail(self, show_id: str) -> dict:
        """Get show with full seat layout for seat selection."""
        show = await self.show_repo.find_by_id(show_id)
        if not show:
            raise HTTPException(status_code=404, detail="Show not found")
        enriched = await self._enrich_show(show)
        enriched["seat_layout"] = show.get("seat_layout", [])
        return enriched

    async def list_shows_by_movie(self, movie_id: str) -> list:
        shows = await self.show_repo.find_by_movie(movie_id)
        result = []
        for show in shows:
            result.append(await self._enrich_show(show))
        return result

    async def list_all_shows(self) -> list:
        shows = await self.show_repo.find_all()
        result = []
        for show in shows:
            result.append(await self._enrich_show(show))
        return result

    async def update_show(self, show_id: str, data: ShowUpdate) -> dict:
        update_data = data.model_dump(exclude_unset=True)
        show = await self.show_repo.update(show_id, update_data)
        if not show:
            raise HTTPException(status_code=404, detail="Show not found")
        return await self._enrich_show(show)

    async def delete_show(self, show_id: str) -> dict:
        deleted = await self.show_repo.delete(show_id)
        if not deleted:
            raise HTTPException(status_code=404, detail="Show not found")
        return {"message": "Show deleted successfully"}

    def _generate_seat_layout(self, total_rows: int, seats_per_row: int) -> list:
        """Generate seat layout: rows A, B, C... with numbered seats."""
        layout = []
        for r in range(total_rows):
            row_letter = string.ascii_uppercase[r % 26]
            for s in range(1, seats_per_row + 1):
                layout.append({"row": row_letter, "number": s, "status": "available"})
        return layout

    async def _enrich_show(self, show: dict) -> dict:
        """Add movie title, theatre name, and screen number to show dict."""
        movie = await self.movie_repo.find_by_id(show["movie_id"])
        theatre = await self.theatre_repo.find_by_id(show["theatre_id"])
        screen = await self.screen_repo.find_by_id(show["screen_id"])
        return {
            "id": show["_id"],
            "movie_id": show["movie_id"],
            "theatre_id": show["theatre_id"],
            "screen_id": show["screen_id"],
            "show_time": show["show_time"],
            "price": show["price"],
            "available_seats": show["available_seats"],
            "total_seats": show["total_seats"],
            "movie_title": movie["title"] if movie else "Unknown",
            "theatre_name": theatre["name"] if theatre else "Unknown",
            "screen_number": screen["screen_number"] if screen else 0,
        }
