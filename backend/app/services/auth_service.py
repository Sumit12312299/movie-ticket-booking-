from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from app.database.db import get_database
from app.utils.security import decode_access_token
from app.schemas.user_schema import UserProfile

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")

async def get_current_user(token: str = Depends(oauth2_scheme)) -> UserProfile:
    payload = decode_access_token(token)
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials or token expired",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    user_id = payload.get("sub")
    db = get_database()
    users_col = db["users"]
    user_doc = await users_col.find_one({"_id": user_id})
    if not user_doc:
        raise HTTPException(status_code=404, detail="User not found")
        
    return UserProfile(
        id=str(user_doc["_id"]),
        full_name=user_doc["full_name"],
        email=user_doc["email"],
        role=user_doc.get("role", "user"),
        created_at=user_doc.get("created_at"),
        favorites=user_doc.get("favorites", [])
    )

async def get_current_admin(current_user: UserProfile = Depends(get_current_user)) -> UserProfile:
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin privileges required"
        )
    return current_user
