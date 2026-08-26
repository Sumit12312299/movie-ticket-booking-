# Movie ORM model definition
from pydantic import BaseModel, Field
from typing import List, Optional

class MovieBase(BaseModel):
    """
    Base schema for movie properties, providing validation rules.
    Contains movie catalog metadata, format details, and availability status.
    """
    title: str
    synopsis: str
    genre: List[str]
    language: str
    duration_mins: int = Field(..., gt=0)
    rating: float = Field(default=0.0, ge=0.0, le=5.0)
    reviews_count: int = 0
    release_date: str
    poster_url: str
    banner_url: str
    trailer_url: Optional[str] = ""
    status: str = "now_showing"  # Supported values: "now_showing", "coming_soon"
    cast: List[str] = []
    director: Optional[str] = ""

class MovieCreate(MovieBase):
    """
    Schema representing the payload structure for creating a new movie.
    """
    pass

class MovieUpdate(BaseModel):
    """
    Schema containing partial update properties for modifying an existing movie.
    """
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
    """
    Schema for returning Movie data from MongoDB containing database object id.
    """
    id: str
