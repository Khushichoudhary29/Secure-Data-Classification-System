from fastapi import APIRouter, Depends
from app.core.auth import get_current_user

from pydantic import BaseModel
from typing import Optional
from sqlalchemy.orm import Session
from app.core.database import get_db

router = APIRouter(tags=["Users"])


class ProfileUpdateBody(BaseModel):
    full_name: Optional[str] = None


@router.get("/me")
def get_my_profile(current_user=Depends(get_current_user)):
    return {
        "id": current_user.id,
        "full_name": current_user.full_name,
        "email": current_user.email,
        "role_id": current_user.role_id,
        "role": current_user.role.name if current_user.role else "User"
    }


@router.put("/me")
def update_my_profile(
    profile_data: ProfileUpdateBody,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    if profile_data.full_name:
        current_user.full_name = profile_data.full_name
        db.commit()
        db.refresh(current_user)
    return {
        "message": "Profile updated successfully",
        "full_name": current_user.full_name
    }
