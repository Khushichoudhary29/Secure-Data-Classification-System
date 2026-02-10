from fastapi import FastAPI
from app.core.database import Base, engine

app = FastAPI(title="Secure Data Classification System")

Base.metadata.create_all(bind=engine)

@app.get("/")
def root():
    return {"message": "Secure Data Classification System Backend Running"}
