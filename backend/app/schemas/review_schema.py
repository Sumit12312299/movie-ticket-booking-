from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


class ReviewCreate(BaseModel):
    movie_id: str
    rating: int = Field(..., ge=1, le=5)
    comment: str = Field("", max_length=500)


class ReviewResponse(BaseModel):
    id: str
    user_id: str
    user_name: str
    movie_id: str
    rating: int
    comment: str
    created_at: datetime

    class Config:
        from_attributes = True
