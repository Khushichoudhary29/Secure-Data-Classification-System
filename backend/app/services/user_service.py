from sqlalchemy.orm import Session
from app.models.user import User
from app.models.role import Role
from app.core.security import hash_password, verify_password


def get_role_by_name(db: Session, role_name: str):
    return db.query(Role).filter(Role.name == role_name).first()


def create_default_roles(db: Session):
    roles = ["Admin", "Manager", "Employee", "User"]

    for r in roles:
        existing = get_role_by_name(db, r)
        if not existing:
            new_role = Role(name=r)
            db.add(new_role)

    db.commit()

    # Create default Admin user
    admin_email = "admin@gmail.com"

    admin_user = db.query(User).filter(User.email == admin_email).first()

    if not admin_user:
        admin_role = get_role_by_name(db, "Admin")

        new_admin = User(
            full_name="Super Admin",
            email=admin_email,
            password=hash_password("admin123"),
            role_id=admin_role.id
        )

        db.add(new_admin)
        db.commit()



def create_user(db: Session, full_name: str, email: str, password: str):
    existing_user = db.query(User).filter(User.email == email).first()
    if existing_user:
        return None

    user_role = get_role_by_name(db, "User")

    new_user = User(
        full_name=full_name,
        email=email,
        password=hash_password(password),
        role_id=user_role.id
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user


def authenticate_user(db: Session, email: str, password: str):
    from sqlalchemy.orm import joinedload
    user = db.query(User).options(joinedload(User.role)).filter(User.email == email).first()
    if not user:
        return None
    
    if not verify_password(password, user.password):
        return None
    
    return user


