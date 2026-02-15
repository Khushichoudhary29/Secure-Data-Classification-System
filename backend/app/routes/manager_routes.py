from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload

from app.core.database import get_db
from app.core.rbac import role_required
from app.models.user import User
from app.models.role import Role

from app.schemas.manager_schema import ManagerUpdateEmployeeSchema
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

router = APIRouter(prefix="/manager", tags=["Manager Panel"])


@router.get("/dashboard")
def manager_dashboard(user=Depends(role_required(["Manager", "Admin"]))):
    return {
        "message": "Welcome Manager",
        "name": user.full_name,
        "role": user.role.name
    }


@router.get("/employees")
def get_all_employees(
    db: Session = Depends(get_db),
    manager_user=Depends(role_required(["Manager", "Admin"]))
):
    employees = (
        db.query(User)
        .options(joinedload(User.role))
        .join(Role)
        .filter(Role.name.in_(["Employee", "User"]))
        .all()
    )

    return employees


@router.get("/employees/{user_id}")
def get_employee_by_id(
    user_id: int,
    db: Session = Depends(get_db),
    manager_user=Depends(role_required(["Manager", "Admin"]))
):
    employee = (
        db.query(User)
        .options(joinedload(User.role))
        .join(Role)
        .filter(User.id == user_id)
        .filter(Role.name.in_(["Employee", "User"]))
        .first()
    )

    if not employee:
        raise HTTPException(status_code=404, detail="Employee/User not found")

    return employee

@router.put("/employees/{user_id}")
def update_employee(
    user_id: int,
    data: ManagerUpdateEmployeeSchema,
    db: Session = Depends(get_db),
    manager_user=Depends(role_required(["Manager", "Admin"]))
):
    employee = (
        db.query(User)
        .options(joinedload(User.role))
        .join(Role)
        .filter(User.id == user_id)
        .filter(Role.name.in_(["Employee", "User"]))
        .first()
    )

    if not employee:
        raise HTTPException(status_code=404, detail="Employee/User not found")

    if data.full_name:
        employee.full_name = data.full_name

    if data.email:
        employee.email = data.email

    if data.password:
        employee.password = pwd_context.hash(data.password)

    db.commit()
    db.refresh(employee)

    return {
        "message": "Employee updated successfully",
        "id": employee.id,
        "full_name": employee.full_name,
        "email": employee.email,
        "role": employee.role.name
    }

