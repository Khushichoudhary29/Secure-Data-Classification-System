from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload
from pydantic import BaseModel

from app.core.database import get_db
from app.models.user import User
from app.models.role import Role
from app.models.file_model import File as FileModel
from app.core.rbac import role_required
from app.services.user_service import create_default_roles, create_user
from app.schemas.admin_schema import UserWithRoleResponse, RoleResponse
from app.schemas.user_schema import UserCreate, UserResponse
from app.schemas.user_update_schema import UserUpdate

router = APIRouter(tags=["Admin"])


class RoleUpdateBody(BaseModel):
    role_id: int


@router.get("/stats")
def get_admin_stats(
    db: Session = Depends(get_db),
    admin_user=Depends(role_required(["Admin"]))
):
    total_users = db.query(User).count()
    active_admins = db.query(User).join(Role).filter(Role.name == "Admin").count()
    total_files = db.query(FileModel).count()

    roles = db.query(Role).all()
    role_counts = {}
    for r in roles:
        role_counts[r.name] = db.query(User).filter(User.role_id == r.id).count()

    return {
        "total_users": total_users,
        "active_admins": active_admins,
        "uploads_today": total_files,
        "role_counts": role_counts
    }


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
    role_data: RoleUpdateBody,
    db: Session = Depends(get_db),
    admin_user=Depends(role_required(["Admin"]))
):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    role = db.query(Role).filter(Role.id == role_data.role_id).first()
    if not role:
        raise HTTPException(status_code=404, detail="Role not found")

    user.role_id = role_data.role_id
    db.commit()
    db.refresh(user)

    # Log role update event
    from app.services.audit_service import log_event
    log_event(db, admin_user.email, f"Updated role for user {user.email} to {role.name}")

    return {
        "message": f"Role updated successfully for user {user.full_name}",
        "user_id": user.id,
        "new_role": role.name
    }


@router.post("/create-admin", response_model=UserResponse)
def create_admin(
    admin_data: UserCreate,
    db: Session = Depends(get_db),
    admin_user=Depends(role_required(["Admin"]))
):
    create_default_roles(db)

    admin = create_user(
        db,
        full_name=admin_data.full_name,
        email=admin_data.email,
        password=admin_data.password
    )

    if not admin:
        raise HTTPException(status_code=400, detail="Admin already exists")

    # Assign admin role
    admin_role = db.query(Role).filter(Role.name == "Admin").first()
    admin.role_id = admin_role.id
    db.commit()
    db.refresh(admin)
    return admin




@router.get("/roles", response_model=list[RoleResponse])
def get_all_roles(
    db: Session = Depends(get_db),
    admin_user=Depends(role_required(["Admin"]))
):
    roles = db.query(Role).all()
    return roles



    
    
@router.get("/users", response_model=list[UserWithRoleResponse])
def get_all_users(
    db: Session = Depends(get_db),
    admin_user=Depends(role_required(["Admin"]))
):
    users = db.query(User).options(joinedload(User.role)).all()
    return users


@router.get("/user/{user_id}", response_model=UserWithRoleResponse)
def get_user_by_id(
    user_id: int,
    db: Session = Depends(get_db),
    admin_user=Depends(role_required(["Admin"]))
):
    user = db.query(User).options(joinedload(User.role)).filter(User.id == user_id).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return user


@router.delete("/delete-user/{user_id}")
def delete_user(
    user_id: int,
    db: Session = Depends(get_db),
    admin_user=Depends(role_required(["Admin"]))
):
    user = db.query(User).filter(User.id == user_id).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    db.delete(user)
    db.commit()

    # Log user deletion event
    from app.services.audit_service import log_event
    log_event(db, admin_user.email, f"Deleted user account: {user.email}")

    return {"message": f"User {user.full_name} deleted successfully"}




@router.put("/update-user/{user_id}")
def update_user(
    user_id: int,
    update_data: UserUpdate,
    db: Session = Depends(get_db),
    admin_user=Depends(role_required(["Admin"]))
):
    user = db.query(User).filter(User.id == user_id).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if update_data.full_name is not None:
        user.full_name = update_data.full_name

    if update_data.email is not None:
        user.email = update_data.email

    if update_data.role_id is not None:
        role = db.query(Role).filter(Role.id == update_data.role_id).first()
        if not role:
            raise HTTPException(status_code=404, detail="Role not found")

        user.role_id = update_data.role_id

    db.commit()
    db.refresh(user)

    return {
        "message": "User updated successfully",
        "user_id": user.id,
        "full_name": user.full_name,
        "email": user.email,
        "role_id": user.role_id
    }


@router.get("/audit-logs")
def get_audit_logs(
    db: Session = Depends(get_db),
    admin_user=Depends(role_required(["Admin"]))
):
    from app.models.audit_model import AuditLog
    logs = db.query(AuditLog).order_by(AuditLog.id.desc()).all()
    return [{
        "id": log.id,
        "user_email": log.user_email,
        "action": log.action,
        "timestamp": log.timestamp.isoformat(),
        "previous_hash": log.previous_hash,
        "current_hash": log.current_hash
    } for log in logs]


@router.post("/verify-logs")
def verify_logs(
    db: Session = Depends(get_db),
    admin_user=Depends(role_required(["Admin"]))
):
    from app.services.audit_service import verify_audit_chain
    result = verify_audit_chain(db)
    return result



