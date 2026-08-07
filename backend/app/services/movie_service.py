from fastapi import HTTPException, status
from app.repositories.movie_repo import MovieRepository
from app.schemas.movie_schema import MovieCreate, MovieUpdate
from datetime import date


class MovieService:
    """Business logic for movie management."""

    def __init__(self, movie_repo: MovieRepository):
        self.movie_repo = movie_repo

    async def create_movie(self, data: MovieCreate) -> dict:
        """Create a new movie (Admin only)."""
        movie_data = data.model_dump()
        movie_data["release_date"] = data.release_date.isoformat()
        movie = await self.movie_repo.create(movie_data)
        return self._format(movie)

    async def get_movie(self, movie_id: str) -> dict:
        """Get a single movie by ID."""
        movie = await self.movie_repo.find_by_id(movie_id)
        if not movie:
            raise HTTPException(status_code=404, detail="Movie not found")
        return self._format(movie)

    async def list_movies(self, skip: int = 0, limit: int = 50, active_only: bool = True) -> list:
        """List all movies with pagination."""
        movies = await self.movie_repo.find_all(skip=skip, limit=limit, active_only=active_only)
        return [self._format(m) for m in movies]

    async def search_movies(self, keyword: str = "", genre: str = None, language: str = None) -> list:
        """Search and filter movies."""
        movies = await self.movie_repo.search(keyword=keyword, genre=genre, language=language)
        return [self._format(m) for m in movies]

    async def update_movie(self, movie_id: str, data: MovieUpdate) -> dict:
        """Update movie details (Admin only)."""
        update_data = data.model_dump(exclude_unset=True)
        if "release_date" in update_data and update_data["release_date"]:
            update_data["release_date"] = update_data["release_date"].isoformat()
        movie = await self.movie_repo.update(movie_id, update_data)
        if not movie:
            raise HTTPException(status_code=404, detail="Movie not found")
        return self._format(movie)

    async def delete_movie(self, movie_id: str) -> dict:
        """Delete a movie (Admin only)."""
        deleted = await self.movie_repo.delete(movie_id)
        if not deleted:
            raise HTTPException(status_code=404, detail="Movie not found")
        return {"message": "Movie deleted successfully"}

    def _format(self, movie: dict) -> dict:
        return {
            "id": movie["_id"],
            "title": movie["title"],
            "description": movie["description"],
            "language": movie["language"],
            "genre": movie["genre"],
            "duration_mins": movie["duration_mins"],
            "poster_url": movie.get("poster_url", ""),
            "release_date": movie["release_date"],
            "is_active": movie["is_active"],
            "created_at": movie.get("created_at"),
        }
