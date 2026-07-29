from pydantic import BaseModel, Field
from typing import List, Optional

class MovieBase(BaseModel):
    title: str
    synopsis: str
    genre: List[str]
    language: str
    duration_mins: int
    rating: float = 0.0
    reviews_count: int = 0
    release_date: str
    poster_url: str
    banner_url: str
    trailer_url: Optional[str] = ""
    status: str = "now_showing"  # "now_showing", "coming_soon"
    cast: List[str] = []
    director: Optional[str] = ""

class MovieCreate(MovieBase):
    pass

class MovieUpdate(BaseModel):
    title: Optional[str] = None
    synopsis: Optional[str] = None
    genre: Optional[List[str]] = None
    language: Optional[str] = None
    duration_mins: Optional[int] = None
    rating: Optional[float] = None
    release_date: Optional[str] = None
    poster_url: Optional[str] = None
    banner_url: Optional[str] = None
    trailer_url: Optional[str] = None
    status: Optional[str] = None
    cast: Optional[List[str]] = None
    director: Optional[str] = None

class MovieResponse(MovieBase):
    id: str
