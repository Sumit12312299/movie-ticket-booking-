"""
Pydantic Data Schemas for Theater Showtime and Screening Schedules.
"""
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
    id: str = Field(..., description="Unique showtime identifier")
    movie_id: str = Field(..., description="ID of the movie being screened")
    movie_title: Optional[str] = Field("", description="Title of the movie")
    theater_name: str = Field(..., description="Name of the cinema hall/theater")
    screen_type: str = Field(..., description="Screen technology (e.g. IMAX 3D, Standard 2D)")
    show_date: str = Field(..., description="Date of show in YYYY-MM-DD format")
    show_time: str = Field(..., description="Time of show in HH:MM format")
    regular_price: float = Field(..., description="Base ticket price")
    vip_price: float = Field(..., description="VIP/Premium ticket price")
    booked_seats: List[str] = Field(default=[], description="List of reserved seat codes")
    locked_seats: List[str] = Field(default=[], description="List of temporarily held seat codes")
    city: Optional[str] = Field("Mumbai", description="City location of theater")

