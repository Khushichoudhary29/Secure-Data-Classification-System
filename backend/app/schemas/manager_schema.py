from pydantic import BaseModel
from typing import Optional

class ManagerUpdateEmployeeSchema(BaseModel):
    full_name: Optional[str] = None
    email: Optional[str] = None
    password: Optional[str] = None
