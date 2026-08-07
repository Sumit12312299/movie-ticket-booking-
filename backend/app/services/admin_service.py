from app.repositories.user_repo import UserRepository
from app.repositories.movie_repo import MovieRepository
from app.repositories.theatre_repo import TheatreRepository, ScreenRepository
from app.repositories.show_repo import ShowRepository
from app.repositories.booking_repo import BookingRepository


class AdminService:
    """Business logic for admin dashboard statistics."""

    def __init__(
        self,
        user_repo: UserRepository,
        movie_repo: MovieRepository,
        theatre_repo: TheatreRepository,
        show_repo: ShowRepository,
        booking_repo: BookingRepository,
    ):
        self.user_repo = user_repo
        self.movie_repo = movie_repo
        self.theatre_repo = theatre_repo
        self.show_repo = show_repo
        self.booking_repo = booking_repo

    async def get_dashboard_stats(self) -> dict:
        """Return aggregate statistics for the admin dashboard."""
        total_users = await self.user_repo.count()
        total_movies = await self.movie_repo.count(active_only=False)
        active_movies = await self.movie_repo.count(active_only=True)
        total_theatres = await self.theatre_repo.count()
        total_shows = await self.show_repo.count()
        total_bookings = await self.booking_repo.count()
        confirmed_bookings = await self.booking_repo.count(status="confirmed")
        cancelled_bookings = await self.booking_repo.count(status="cancelled")
        total_revenue = await self.booking_repo.get_total_revenue()
        revenue_by_movie = await self.booking_repo.get_revenue_by_movie()

        return {
            "total_users": total_users,
            "total_movies": total_movies,
            "active_movies": active_movies,
            "total_theatres": total_theatres,
            "total_shows": total_shows,
            "total_bookings": total_bookings,
            "confirmed_bookings": confirmed_bookings,
            "cancelled_bookings": cancelled_bookings,
            "total_revenue": total_revenue,
            "revenue_by_movie": revenue_by_movie,
        }

    async def get_all_users(self) -> list:
        users = await self.user_repo.find_all()
        return [
            {
                "id": u["_id"],
                "name": u["name"],
                "email": u["email"],
                "role": u["role"],
                "created_at": u.get("created_at"),
            }
            for u in users
        ]
