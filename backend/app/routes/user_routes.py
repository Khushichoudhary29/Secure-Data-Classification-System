from fastapi import APIRouter, Depends
from app.core.auth import get_current_user

router = APIRouter(tags=["Users"])

@router.get("/me")
def get_my_profile(current_user=Depends(get_current_user)):
    return {
        "id": current_user.id,
        "full_name": current_user.full_name,
        "email": current_user.email,
        "role_id": current_user.role_id
    }
