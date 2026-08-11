from pydantic import BaseModel, Field
from typing import List, Optional

class SeatLockRequest(BaseModel):
    showtime_id: str
    seats: List[str]

class BookingCreate(BaseModel):
    showtime_id: str
    movie_id: str
    movie_title: str
    theater_name: str
    show_date: str
    show_time: str
    screen_type: str
    seats: List[str]
    total_amount: float = Field(..., ge=0.0)
    payment_method: str = "Credit Card"  # "Credit Card", "UPI", "Net Banking", "Wallet"
    snacks: Optional[List[str]] = None

class BookingResponse(BaseModel):
    id: str
    booking_reference: str
    user_id: str
    user_name: str
    user_email: str
    movie_id: str
    movie_title: str
    theater_name: str
    show_date: str
    show_time: str
    screen_type: str
    seats: List[str]
    total_amount: float
    payment_method: str
    status: str  # "CONFIRMED", "CANCELLED"
    booking_time: str
    qr_code_data: str
    snacks: Optional[List[str]] = None
