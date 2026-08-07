from fastapi import HTTPException
from app.repositories.booking_repo import BookingRepository
from app.repositories.show_repo import ShowRepository
from app.repositories.movie_repo import MovieRepository
from app.repositories.theatre_repo import TheatreRepository, ScreenRepository
from app.schemas.booking_schema import BookingCreate


class BookingService:
    """Business logic for booking management."""

    def __init__(
        self,
        booking_repo: BookingRepository,
        show_repo: ShowRepository,
        movie_repo: MovieRepository,
        theatre_repo: TheatreRepository,
    ):
        self.booking_repo = booking_repo
        self.show_repo = show_repo
        self.movie_repo = movie_repo
        self.theatre_repo = theatre_repo

    async def create_booking(self, user_id: str, data: BookingCreate) -> dict:
        """Book tickets: validate seats, update show, create booking."""
        show = await self.show_repo.find_by_id(data.show_id)
        if not show:
            raise HTTPException(status_code=404, detail="Show not found")

        # Validate seats are available
        seat_layout = show.get("seat_layout", [])
        for seat_label in data.seats:
            row = seat_label[0]
            number = int(seat_label[1:])
            found = False
            for seat in seat_layout:
                if seat["row"] == row and seat["number"] == number:
                    if seat["status"] != "available":
                        raise HTTPException(
                            status_code=400,
                            detail=f"Seat {seat_label} is already booked",
                        )
                    found = True
                    break
            if not found:
                raise HTTPException(status_code=400, detail=f"Seat {seat_label} does not exist")

        # Update seats to booked
        await self.show_repo.update_seat_status(data.show_id, data.seats, "booked")

        # Get movie info for the booking record
        movie = await self.movie_repo.find_by_id(show["movie_id"])
        theatre = await self.theatre_repo.find_by_id(show["theatre_id"])

        total_amount = show["price"] * len(data.seats)

        booking_data = {
            "user_id": user_id,
            "show_id": data.show_id,
            "seats": data.seats,
            "total_amount": total_amount,
            "movie_title": movie["title"] if movie else "Unknown",
            "theatre_name": theatre["name"] if theatre else "Unknown",
            "show_time": show["show_time"],
            "screen_number": show.get("screen_id", ""),
        }

        booking = await self.booking_repo.create(booking_data)
        return self._format(booking)

    async def get_user_bookings(self, user_id: str) -> list:
        bookings = await self.booking_repo.find_by_user(user_id)
        return [self._format(b) for b in bookings]

    async def get_all_bookings(self) -> list:
        bookings = await self.booking_repo.find_all()
        return [self._format(b) for b in bookings]

    async def cancel_booking(self, booking_id: str, user_id: str) -> dict:
        booking = await self.booking_repo.find_by_id(booking_id)
        if not booking:
            raise HTTPException(status_code=404, detail="Booking not found")
        if booking["user_id"] != user_id:
            raise HTTPException(status_code=403, detail="Not authorized to cancel this booking")
        if booking["status"] == "cancelled":
            raise HTTPException(status_code=400, detail="Booking already cancelled")

        # Free up the seats
        await self.show_repo.update_seat_status(booking["show_id"], booking["seats"], "available")
        cancelled = await self.booking_repo.cancel(booking_id)
        return self._format(cancelled)

    async def get_revenue(self) -> dict:
        total = await self.booking_repo.get_total_revenue()
        by_movie = await self.booking_repo.get_revenue_by_movie()
        total_bookings = await self.booking_repo.count(status="confirmed")
        cancelled_count = await self.booking_repo.count(status="cancelled")
        return {
            "total_revenue": total,
            "total_bookings": total_bookings,
            "cancelled_bookings": cancelled_count,
            "revenue_by_movie": by_movie,
        }

    def _format(self, b: dict) -> dict:
        return {
            "id": b["_id"],
            "user_id": b["user_id"],
            "show_id": b["show_id"],
            "seats": b["seats"],
            "total_amount": b["total_amount"],
            "status": b["status"],
            "booking_time": b["booking_time"],
            "movie_title": b.get("movie_title"),
            "theatre_name": b.get("theatre_name"),
            "show_time": b.get("show_time"),
            "screen_number": b.get("screen_number"),
        }
