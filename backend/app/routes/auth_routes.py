from fastapi import APIRouter, HTTPException, Depends, status
from datetime import datetime
from app.database.db import get_database
from app.utils.security import get_password_hash, verify_password, create_access_token
from app.schemas.user_schema import UserCreate, UserLogin, UserProfile, Token
from app.services.auth_service import get_current_user

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/register", response_model=Token, status_code=status.HTTP_201_CREATED)
async def register(user_data: UserCreate):
    db = get_database()
    users_col = db["users"]
    
    existing = await users_col.find_one({"email": user_data.email.lower()})
    if existing:
        raise HTTPException(status_code=400, detail="An account with this email already exists")

    hashed_pw = get_password_hash(user_data.password)
    new_user = {
        "full_name": user_data.full_name,
        "email": user_data.email.lower(),
        "password": hashed_pw,
        "role": user_data.role if user_data.role in ["user", "admin"] else "user",
        "created_at": datetime.utcnow().isoformat(),
        "favorites": []
    }
    
    result = await users_col.insert_one(new_user)
    user_id = str(result.inserted_id)

    access_token = create_access_token(subject=user_id, role=new_user["role"])
    
    user_profile = UserProfile(
        id=user_id,
        full_name=new_user["full_name"],
        email=new_user["email"],
        role=new_user["role"],
        created_at=new_user["created_at"],
        favorites=[]
    )
    return Token(access_token=access_token, user=user_profile)

@router.post("/login", response_model=Token)
async def login(credentials: UserLogin):
    db = get_database()
    users_col = db["users"]
    
    user_doc = await users_col.find_one({"email": credentials.email.lower()})
    if not user_doc or not verify_password(credentials.password, user_doc["password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )
    
    user_id = str(user_doc["_id"])
    role = user_doc.get("role", "user")
    access_token = create_access_token(subject=user_id, role=role)
    
    user_profile = UserProfile(
        id=user_id,
        full_name=user_doc["full_name"],
        email=user_doc["email"],
        role=role,
        created_at=user_doc.get("created_at"),
        favorites=user_doc.get("favorites", [])
    )
    return Token(access_token=access_token, user=user_profile)

@router.get("/me", response_model=UserProfile)
async def get_me(current_user: UserProfile = Depends(get_current_user)):
    return current_user

@router.post("/favorites/{movie_id}")
async def toggle_favorite(movie_id: str, current_user: UserProfile = Depends(get_current_user)):
    db = get_database()
    users_col = db["users"]
    
    favs = list(current_user.favorites or [])
    if movie_id in favs:
        favs.remove(movie_id)
        action = "removed"
    else:
        favs.append(movie_id)
        action = "added"
        
    await users_col.update_one({"_id": current_user.id}, {"$set": {"favorites": favs}})
    return {"status": "success", "action": action, "favorites": favs}
