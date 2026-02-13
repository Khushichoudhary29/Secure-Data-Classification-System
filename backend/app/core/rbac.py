from fastapi import Depends, HTTPException, status
from app.core.auth import get_current_user

def role_required(allowed_roles: list):
    def checker(user=Depends(get_current_user)):

        if not user or not user.role:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid user or role not found"
            )

        if user.role.name not in allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Access denied"
            )

        return user

    return checker

