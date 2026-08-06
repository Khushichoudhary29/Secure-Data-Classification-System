from sqlalchemy import Column, Integer, String, DateTime, func
from app.core.database import Base

class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True, index=True)
    user_email = Column(String, index=True)
    action = Column(String)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())
    previous_hash = Column(String, nullable=True)
    current_hash = Column(String)
