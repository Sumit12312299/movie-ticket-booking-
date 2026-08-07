from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


class PaymentCreate(BaseModel):
    booking_id: str
    payment_method: str = Field(..., pattern="^(credit_card|debit_card|upi|net_banking)$")
    amount: float = Field(..., gt=0)


class PaymentResponse(BaseModel):
    id: str
    booking_id: str
    user_id: str
    amount: float
    payment_method: str
    status: str  # success, failed, refunded
    transaction_id: str
    payment_time: datetime

    class Config:
        from_attributes = True
