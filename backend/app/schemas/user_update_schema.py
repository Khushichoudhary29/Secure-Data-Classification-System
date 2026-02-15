from pydantic import BaseModel, EmailStr
from typing import Optional


class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    email: Optional[EmailStr] = None
    role_id: Optional[int] = None
