from fastapi import APIRouter, Depends
from app.utils.jwt_handler import get_current_user

router = APIRouter()

@router.get("/protected")
def protected_route(current_user=Depends(get_current_user)):
    return {
        "message": "You are authorized!",
        "user": current_user
    }
