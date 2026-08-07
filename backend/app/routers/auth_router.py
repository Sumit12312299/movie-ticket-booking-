from fastapi import APIRouter, Depends, Body
from fastapi.security import OAuth2PasswordRequestForm
from motor.motor_asyncio import AsyncIOMotorDatabase
from app.dependencies.auth import get_db, get_current_user
from app.repositories.user_repo import UserRepository
from app.services.auth_service import AuthService
from app.schemas.user_schema import (
    UserRegister, UserUpdate, ChangePassword,
    TokenResponse, UserResponse,
)

router = APIRouter(prefix="/api/auth", tags=["Authentication"])


def _get_service(db: AsyncIOMotorDatabase) -> AuthService:
    return AuthService(UserRepository(db))


@router.post("/register", response_model=TokenResponse, status_code=201)
async def register(data: UserRegister, db: AsyncIOMotorDatabase = Depends(get_db)):
    """Register a new customer account."""
    service = _get_service(db)
    return await service.register(data)


@router.post("/login", response_model=TokenResponse)
async def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: AsyncIOMotorDatabase = Depends(get_db),
):
    """Login with email and password. Use 'username' field for email."""
    service = _get_service(db)
    return await service.login(form_data.username, form_data.password)


@router.post("/login/json", response_model=TokenResponse)
async def login_json(
    email: str = Body(...),
    password: str = Body(...),
    db: AsyncIOMotorDatabase = Depends(get_db),
):
    """Login with JSON body (for frontend convenience)."""
    service = _get_service(db)
    return await service.login(email, password)


@router.get("/profile", response_model=UserResponse)
async def get_profile(
    current_user: dict = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_db),
):
    """Get current user's profile."""
    service = _get_service(db)
    return await service.get_profile(current_user["_id"])


@router.put("/profile", response_model=UserResponse)
async def update_profile(
    data: UserUpdate,
    current_user: dict = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_db),
):
    """Update current user's profile."""
    service = _get_service(db)
    return await service.update_profile(current_user["_id"], data)


@router.post("/change-password")
async def change_password(
    data: ChangePassword,
    current_user: dict = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_db),
):
    """Change current user's password."""
    service = _get_service(db)
    return await service.change_password(current_user["_id"], data)
