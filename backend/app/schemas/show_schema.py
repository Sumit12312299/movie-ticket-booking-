from pydantic import BaseModel, Field
from typing import Optional, List, Dict
from datetime import datetime


# ---------- Seat ----------

class Seat(BaseModel):
    row: str
    number: int
    status: str = "available"  # available, booked


# ---------- Request Schemas ----------

class ShowCreate(BaseModel):
    movie_id: str
    theatre_id: str
    screen_id: str
    show_time: datetime
    price: float = Field(..., gt=0)


class ShowUpdate(BaseModel):
    show_time: Optional[datetime] = None
    price: Optional[float] = None


# ---------- Response Schemas ----------

class ShowResponse(BaseModel):
    id: str
    movie_id: str
    theatre_id: str
    screen_id: str
    show_time: datetime
    price: float
    available_seats: int
    total_seats: int
    movie_title: Optional[str] = None
    theatre_name: Optional[str] = None
    screen_number: Optional[int] = None

    class Config:
        from_attributes = True


class ShowDetailResponse(ShowResponse):
    seat_layout: List[Seat] = []
