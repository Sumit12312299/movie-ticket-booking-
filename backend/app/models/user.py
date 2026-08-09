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
    User login request payload model containing email and password credentials.
    """
    email: str = Field(..., description="The user registration email address")
    password: str = Field(..., description="The user account password")

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
    Authentication success token response containing JWT and user profile metadata.
    """
    access_token: str = Field(..., description="JWT access token string representing user session")
    token_type: str = Field(default="bearer", description="The token type prefix used in headers")
    user: UserResponse
