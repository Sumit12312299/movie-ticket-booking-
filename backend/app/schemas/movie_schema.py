from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import date, datetime


# ---------- Request Schemas ----------

class MovieCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=200)
    description: str = Field(..., min_length=10)
    language: str = Field(..., min_length=2)
    genre: List[str] = Field(..., min_length=1)
    duration_mins: int = Field(..., gt=0)
    poster_url: str = ""
    release_date: date
    is_active: bool = True


class MovieUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    language: Optional[str] = None
    genre: Optional[List[str]] = None
    duration_mins: Optional[int] = None
    poster_url: Optional[str] = None
    release_date: Optional[date] = None
    is_active: Optional[bool] = None


# ---------- Response Schemas ----------

class MovieResponse(BaseModel):
    id: str
    title: str
    description: str
    language: str
    genre: List[str]
    duration_mins: int
    poster_url: str
    release_date: date
    is_active: bool
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True
