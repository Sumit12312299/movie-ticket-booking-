"""
Authentication services module.
Provides FastAPI dependencies for verifying authenticated user sessions
and enforcing administrator role constraints.
"""
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from app.database.db import get_database
from app.utils.security import decode_access_token
from app.schemas.user_schema import UserProfile

from app.utils.logger import logger

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")

async def get_current_user(token: str = Depends(oauth2_scheme)) -> UserProfile:
    """
    Dependency to fetch and validate the current authenticated user's session profile.
    Decodes the JWT access token and queries user parameters from MongoDB database.
    """
    payload = decode_access_token(token)
    if not payload:
        logger.warning("Failed to decode JWT access token or token expired")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials or token expired",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    user_id = payload.get("sub")
    db = get_database()
    users_col = db["users"]
    user_doc = await users_col.find_one({"_id": user_id})
    if not user_doc and len(str(user_id)) == 24:
        try:
            from bson import ObjectId
            user_doc = await users_col.find_one({"_id": ObjectId(user_id)})
        except Exception:
            pass

    if not user_doc:
        logger.warning(f"User with ID {user_id} not found in database")
        raise HTTPException(status_code=404, detail="User not found")
        
    return UserProfile(
        id=str(user_doc["_id"]),
        full_name=user_doc["full_name"],
        email=user_doc["email"],
        role=user_doc.get("role", "user"),
        created_at=user_doc.get("created_at"),
        favorites=user_doc.get("favorites", []),
        wallet_balance=float(user_doc.get("wallet_balance", 1500.00))
    )

async def get_current_admin(current_user: UserProfile = Depends(get_current_user)) -> UserProfile:
    """
    Dependency to assert that the current authenticated user has administrative privileges.
    Checks the resolved role flag in user profile and raises HTTP 403 if unauthorized.
    """
    if not is_admin_user(current_user):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin privileges required"
        )
    return current_user

def is_admin_user(user: UserProfile) -> bool:
    """
    Checks if the user has administrative privileges.

    Args:
        user (UserProfile): The user profile object.

    Returns:
        bool: True if user role is admin, False otherwise.
    """
    return user.role == "admin"

