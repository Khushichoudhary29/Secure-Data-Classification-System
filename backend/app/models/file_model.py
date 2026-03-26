from sqlalchemy import Column, Integer, String
from app.core.database import Base

class File(Base):
    __tablename__ = "files"

    id = Column(Integer, primary_key=True, index=True)
    original_filename = Column(String)
    stored_filename = Column(String)
    classification = Column(String)
    iv = Column(String)