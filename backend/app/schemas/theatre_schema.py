from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime


# ---------- Request Schemas ----------

class TheatreCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=200)
    location: str = Field(..., min_length=2)
    total_screens: int = Field(..., gt=0)


class TheatreUpdate(BaseModel):
    name: Optional[str] = None
    location: Optional[str] = None
    total_screens: Optional[int] = None


class ScreenCreate(BaseModel):
    theatre_id: str
    screen_number: int = Field(..., gt=0)
    total_rows: int = Field(default=10, gt=0)
    seats_per_row: int = Field(default=12, gt=0)


class ScreenUpdate(BaseModel):
    total_rows: Optional[int] = None
    seats_per_row: Optional[int] = None


# ---------- Response Schemas ----------

class TheatreResponse(BaseModel):
    id: str
    name: str
    location: str
    total_screens: int
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class ScreenResponse(BaseModel):
    id: str
    theatre_id: str
    screen_number: int
    total_rows: int
    seats_per_row: int
    seat_capacity: int

    class Config:
        from_attributes = True
