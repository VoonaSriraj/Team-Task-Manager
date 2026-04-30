from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import os
from .database import engine, Base
from .routers import auth_router, projects_router, tasks_router, users_router

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Team Task Manager API")

# Configure CORS
origins = [
    "http://localhost:5173", # Vite default
    "http://127.0.0.1:5173",
    "*" # For Railway frontend testing (change in prod)
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router.router, prefix="/api/auth", tags=["Auth"])
app.include_router(users_router.router, prefix="/api/users", tags=["Users"])
app.include_router(projects_router.router, prefix="/api/projects", tags=["Projects"])
app.include_router(tasks_router.router, prefix="/api/tasks", tags=["Tasks"])

@app.get("/api")
def read_root():
    return {"message": "Welcome to the Team Task Manager API"}

# Serve React frontend in production
frontend_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), "frontend", "dist")
if os.path.exists(frontend_path):
    app.mount("/assets", StaticFiles(directory=os.path.join(frontend_path, "assets")), name="assets")
    
    @app.get("/{full_path:path}")
    async def catch_all(full_path: str):
        # Allow API routes to pass through (though they shouldn't hit this due to routing order)
        if full_path.startswith("api/"):
            return {"detail": "Not Found"}
            
        file_path = os.path.join(frontend_path, full_path)
        if os.path.exists(file_path) and os.path.isfile(file_path):
            return FileResponse(file_path)
        return FileResponse(os.path.join(frontend_path, "index.html"))

