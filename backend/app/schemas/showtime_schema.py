from pydantic import BaseModel, Field
from typing import List, Optional

class ShowtimeCreate(BaseModel):
    movie_id: str
    theater_name: str
    screen_type: str = "Standard 2D"  # "Standard 2D", "IMAX 3D", "VIP Dolby"
    show_date: str  # YYYY-MM-DD
    show_time: str  # HH:MM
    regular_price: float = Field(12.50, gt=0.0)
    vip_price: float = Field(18.00, gt=0.0)
    city: Optional[str] = "Mumbai"

class ShowtimeResponse(BaseModel):
    id: str
    movie_id: str
    movie_title: Optional[str] = ""
    theater_name: str
    screen_type: str
    show_date: str
    show_time: str
    regular_price: float
    vip_price: float
    booked_seats: List[str] = []
    locked_seats: List[str] = []
    city: Optional[str] = "Mumbai"
