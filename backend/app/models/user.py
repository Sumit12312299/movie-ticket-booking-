from pydantic import BaseModel, EmailStr, Field
from typing import Optional

class UserRegister(BaseModel):
    """
    User registration payload structure validation model.
    """
    full_name: str = Field(..., min_length=2, example="Jane Doe")
    email: str = Field(..., example="jane@example.com")
    password: str = Field(..., min_length=6, example="password123")
    role: Optional[str] = "user"  # "user" or "admin"

class UserLogin(BaseModel):
    """
    User login request payload model.
    """
    email: str
    password: str

class UserResponse(BaseModel):
    """
    Standard user profile API response schema (excluding password).
    """
    id: str
    full_name: str
    email: str
    role: str # Allowed values: "user" | "admin"
    created_at: Optional[str] = None

class TokenResponse(BaseModel):
    """
    Authentication success token response containing JWT and user profile.
    """
    access_token: str
    token_type: str = "bearer"
    user: UserResponse
