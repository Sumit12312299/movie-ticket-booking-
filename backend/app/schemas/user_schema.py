from pydantic import BaseModel, Field, EmailStr
from typing import Optional, List

class UserCreate(BaseModel):
    full_name: str = Field(..., min_length=2, example="Alex Morgan")
    email: str = Field(..., example="alex@example.com")
    password: str = Field(..., min_length=6, example="secret123")
    role: Optional[str] = "user"  # "user" or "admin"

class UserLogin(BaseModel):
    email: str
    password: str

class UserProfile(BaseModel):
    id: str
    full_name: str
    email: str
    role: str
    created_at: Optional[str] = None
    favorites: Optional[List[str]] = []

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserProfile
