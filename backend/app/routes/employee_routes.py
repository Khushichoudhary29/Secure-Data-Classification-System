from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.rbac import role_required
from app.models.user import User

router = APIRouter(prefix="/employee", tags=["Employee Panel"])


@router.get("/dashboard")
def employee_dashboard(user=Depends(role_required(["Employee"]))):
    return {
        "message": "Welcome Employee",
        "name": user.full_name,
        "email": user.email,
        "role": user.role.name
    }


@router.get("/my-profile")
def my_profile(user=Depends(role_required(["Employee"])), db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.id == user.id).first()

    return {
        "id": db_user.id,
        "full_name": db_user.full_name,
        "email": db_user.email,
        "role": db_user.role.name
    }
