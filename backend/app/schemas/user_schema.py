"""
Pydantic Data Models for User Authentication, Profiles, and Wallet Operations.
"""
from pydantic import BaseModel, Field, EmailStr
from typing import Optional, List

class UserCreate(BaseModel):
    full_name: str = Field(..., min_length=2, example="Alex Morgan")
    email: EmailStr = Field(..., example="alex@example.com")
    password: str = Field(..., min_length=6, example="secret123")
    role: Optional[str] = "user"  # "user" or "admin"

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserProfile(BaseModel):
    id: str
    full_name: str
    email: str
    role: str
    created_at: Optional[str] = None
    favorites: Optional[List[str]] = []
    wallet_balance: float = 1500.00

class WalletTopupRequest(BaseModel):
    amount: float = Field(..., gt=0, example=500.0)

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserProfile

class PhoneValidationRequest(BaseModel):
    phone_number: str = Field(..., pattern=r"^[6-9]\d{9}$", description="10-digit Indian mobile number starting with 6-9")


