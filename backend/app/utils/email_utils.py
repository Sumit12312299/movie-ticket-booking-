from __future__ import annotations
from typing import Any

def booking_confirmation_body(booking: Any) -> str:
    seats = ", ".join(getattr(booking, "seats", []) or [])
    return f"Hi,\n\nBooking Confirmed!\nMovie: {getattr(booking, 'movie_title', 'N/A')}\nSeats: {seats}\nTotal: Rs.{getattr(booking, 'total_amount', 0):.2f}\n"

def cancellation_body(booking: Any, refund_amount: float) -> str:
    return f"Hi,\n\nBooking Cancelled.\nMovie: {getattr(booking, 'movie_title', 'N/A')}\nRefund: Rs.{refund_amount:.2f}\n"

def otp_body(otp: str, purpose: str = "verification") -> str:
    return f"Your {purpose} OTP is: {otp}\nExpires in 10 minutes.\n"
