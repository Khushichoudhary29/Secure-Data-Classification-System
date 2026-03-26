from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.database import Base, engine

# ROUTES
from app.routes.auth_routes import router as auth_router
from app.routes.user_routes import router as user_router
from app.routes.admin_routes import router as admin_router
from app.routes.manager_routes import router as manager_router
from app.routes.employee_routes import router as employee_router
from app.routes.file_routes import router as file_router

# MODELS (IMPORTANT for table creation)
from app.models import user, role, file_model

# CREATE TABLES
Base.metadata.create_all(bind=engine)

# CREATE APP (ONLY ONCE)
app = FastAPI(title="Secure Data Classification System")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# INCLUDE ROUTERS (CLEAN + NO DUPLICATES)

app.include_router(auth_router, prefix="/auth", tags=["Auth"])
app.include_router(user_router, prefix="/users", tags=["Users"])
app.include_router(admin_router, prefix="/admin", tags=["Admin"])
app.include_router(manager_router, prefix="/manager", tags=["Manager"])
app.include_router(employee_router, prefix="/employee", tags=["Employee"])
app.include_router(file_router, prefix="/files", tags=["Files"])


@app.get("/")
def root():
    return {"message": "Secure Data Classification System Backend Running"}