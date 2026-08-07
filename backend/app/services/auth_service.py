from fastapi import HTTPException, status
from app.repositories.user_repo import UserRepository
from app.auth.password import hash_password, verify_password
from app.auth.jwt_handler import create_access_token
from app.schemas.user_schema import UserRegister, UserUpdate, ChangePassword


class AuthService:
    """Business logic for authentication and user management."""

    def __init__(self, user_repo: UserRepository):
        self.user_repo = user_repo

    async def register(self, data: UserRegister) -> dict:
        """Register a new user."""
        existing = await self.user_repo.find_by_email(data.email)
        if existing:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered",
            )

        user_data = {
            "name": data.name,
            "email": data.email,
            "password_hash": hash_password(data.password),
            "role": "customer",
        }
        user = await self.user_repo.create(user_data)
        token = create_access_token(subject=user["_id"], extra_claims={"role": user["role"]})
        return {
            "access_token": token,
            "token_type": "bearer",
            "user": {
                "id": user["_id"],
                "name": user["name"],
                "email": user["email"],
                "role": user["role"],
                "created_at": user.get("created_at"),
            },
        }

    async def login(self, email: str, password: str) -> dict:
        """Authenticate user and return JWT token."""
        user = await self.user_repo.find_by_email(email)
        if not user or not verify_password(password, user["password_hash"]):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password",
            )

        token = create_access_token(subject=user["_id"], extra_claims={"role": user["role"]})
        return {
            "access_token": token,
            "token_type": "bearer",
            "user": {
                "id": user["_id"],
                "name": user["name"],
                "email": user["email"],
                "role": user["role"],
                "created_at": user.get("created_at"),
            },
        }

    async def get_profile(self, user_id: str) -> dict:
        """Get user profile by ID."""
        user = await self.user_repo.find_by_id(user_id)
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        return {
            "id": user["_id"],
            "name": user["name"],
            "email": user["email"],
            "role": user["role"],
            "created_at": user.get("created_at"),
        }

    async def update_profile(self, user_id: str, data: UserUpdate) -> dict:
        """Update user profile."""
        update_data = data.model_dump(exclude_unset=True)
        if not update_data:
            raise HTTPException(status_code=400, detail="Nothing to update")

        if "email" in update_data:
            existing = await self.user_repo.find_by_email(update_data["email"])
            if existing and existing["_id"] != user_id:
                raise HTTPException(status_code=400, detail="Email already in use")

        user = await self.user_repo.update(user_id, update_data)
        return {
            "id": user["_id"],
            "name": user["name"],
            "email": user["email"],
            "role": user["role"],
            "created_at": user.get("created_at"),
        }

    async def change_password(self, user_id: str, data: ChangePassword) -> dict:
        """Change user's password."""
        user = await self.user_repo.find_by_id(user_id)
        if not verify_password(data.current_password, user["password_hash"]):
            raise HTTPException(status_code=400, detail="Current password is incorrect")

        await self.user_repo.update(user_id, {"password_hash": hash_password(data.new_password)})
        return {"message": "Password changed successfully"}
