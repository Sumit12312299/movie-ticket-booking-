from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime


# ---------- Request Schemas ----------

class BookingCreate(BaseModel):
    show_id: str
    seats: List[str] = Field(..., min_length=1)  # e.g. ["A1", "A2"]


# ---------- Response Schemas ----------

class BookingResponse(BaseModel):
    id: str
    user_id: str
    show_id: str
    seats: List[str]
    total_amount: float
    status: str  # confirmed, cancelled
    booking_time: datetime
    movie_title: Optional[str] = None
    theatre_name: Optional[str] = None
    show_time: Optional[datetime] = None
    screen_number: Optional[int] = None

    class Config:
        from_attributes = True
