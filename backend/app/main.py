from fastapi import FastAPI
from app.core.database import Base, engine
from app.routes.auth_routes import router as auth_router
from app.routes.user_routes import router as user_router
from app.routes.test_routes import router as test_router
from app.models import user, role

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Secure Data Classification System")

app.include_router(auth_router)
app.include_router(user_router)
app.include_router(test_router)

@app.get("/")
def root():
    return {"message": "Secure Data Classification System Backend Running"}

