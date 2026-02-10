from fastapi import FastAPI
from app.core.database import Base, engine
from app.routes.auth_routes import router as auth_router
from app.models import user, role

app = FastAPI(title="Secure Data Classification System")

Base.metadata.create_all(bind=engine)

app.include_router(auth_router)

@app.get("/")
def root():
    return {"message": "Secure Data Classification System Backend Running"}
