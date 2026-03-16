from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.database import Base, engine
from app.routes.auth_routes import router as auth_router
from app.routes.user_routes import router as user_router
from app.routes.test_routes import router as test_router
from app.models import user, role
from app.routes.admin_routes import router as admin_router
from app.routes.manager_routes import router as manager_router
from app.routes.employee_routes import router as employee_router



Base.metadata.create_all(bind=engine)

app = FastAPI(title="Secure Data Classification System")

# CORS middleware - allow all origins for development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(user_router)
app.include_router(test_router)
app.include_router(admin_router)
app.include_router(manager_router)
app.include_router(employee_router)



@app.get("/")
def root():
    return {"message": "Secure Data Classification System Backend Running"}
