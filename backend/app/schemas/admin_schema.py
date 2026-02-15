from pydantic import BaseModel, EmailStr


class RoleResponse(BaseModel):
    id: int
    name: str

    class Config:
        from_attributes = True


class UserWithRoleResponse(BaseModel):
    id: int
    full_name: str
    email: EmailStr
    role: RoleResponse

    class Config:
        from_attributes = True
