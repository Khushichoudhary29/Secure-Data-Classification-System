from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.user import User
from app.models.role import Role
from app.core.rbac import role_required
from app.services.user_service import create_default_roles, create_user


router = APIRouter(prefix="/admin", tags=["Admin Panel"])



@router.get("/dashboard")
def admin_dashboard(user=Depends(role_required(["Admin"]))):
    return {
        "message": "Welcome Admin",
        "admin_name": user.full_name,
        "role": user.role.name
    }


@router.get("/manager-access")
def manager_access(user=Depends(role_required(["Admin", "Manager"]))):
    return {
        "message": "Welcome Admin/Manager",
        "name": user.full_name,
        "role": user.role.name
    }
    
@router.put("/update-role/{user_id}")
def update_user_role(
    user_id: int,
    role_id: int,
    db: Session = Depends(get_db),
    admin_user=Depends(role_required(["Admin"]))
):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    role = db.query(Role).filter(Role.id == role_id).first()
    if not role:
        raise HTTPException(status_code=404, detail="Role not found")

    user.role_id = role_id
    db.commit()
    db.refresh(user)

    return {
        "message": f"Role updated successfully for user {user.full_name}",
        "user_id": user.id,
        "new_role": role.name
    }



@router.post("/create-admin")
def create_admin(db: Session = Depends(get_db)):
    create_default_roles(db)

    admin = create_user(
        db,
        full_name="Admin User",
        email="admin@gmail.com",
        password="admin123"
    )

    if not admin:
        raise HTTPException(status_code=400, detail="Admin already exists")

    # Assign admin role
    admin_role = db.query(Role).filter(Role.name == "Admin").first()
    admin.role_id = admin_role.id
    db.commit()
    db.refresh(admin)

    return {"message": "Admin created successfully", "email": admin.email}
