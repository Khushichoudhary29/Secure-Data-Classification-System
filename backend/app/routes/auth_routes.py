from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.schemas.user_schema import UserCreate, UserResponse
from app.services.user_service import create_user, create_default_roles

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/register", response_model=UserResponse)
def register(user: UserCreate, db: Session = Depends(get_db)):

    # create default roles (only once)
    create_default_roles(db)

    new_user = create_user(db, user.full_name, user.email, user.password)

    if not new_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    return new_user
