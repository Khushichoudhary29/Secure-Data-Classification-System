from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.schemas.user_schema import UserCreate, UserResponse
from app.services.user_service import create_user, create_default_roles
from app.schemas.user_schema import UserLogin
from app.services.user_service import authenticate_user
from app.core.security import create_access_token
from fastapi.security import OAuth2PasswordRequestForm
from app.core.rbac import role_required




router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/register", response_model=UserResponse)
def register(user: UserCreate, db: Session = Depends(get_db)):

    # create default roles (only once)
    create_default_roles(db)

    new_user = create_user(db, user.full_name, user.email, user.password)

    if not new_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    return new_user

@router.post("/login")
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):

    db_user = authenticate_user(db, form_data.username, form_data.password)

    if not db_user:
        raise HTTPException(status_code=401, detail="Invalid email or password")

    token = create_access_token({"user_id": db_user.id, "role_id": db_user.role_id})

    # Get role name from the user object
    role_name = db_user.role.name if db_user.role else "User"

    return {
        "access_token": token,
        "token_type": "bearer",
        "role": role_name
    }
    


