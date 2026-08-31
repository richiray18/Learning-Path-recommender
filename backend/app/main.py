from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from app.core.config import settings
from app.database.database import engine, Base
from app.database.seed import seed_database
from app.api import (
    auth, profile, goals, skills, courses,
    recommendations, learning_path, progress,
    assessments, feedback, tutor, dashboard
)

# Initialize database schema and seed if needed
try:
    Base.metadata.create_all(bind=engine)
    seed_database()
except Exception as e:
    print(f"Database initialization notice: {e}")

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Mentora — Personalized Learning Platform Backend API. Powered by deterministic recommendation models, adaptive engines, and Gemini AI.",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list if settings.cors_origin_list else ["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Health check
@app.get("/health", tags=["Health"])
def health_check():
    db_connected = False
    try:
        with engine.connect() as conn:
            db_connected = True
    except Exception:
        db_connected = False

    return {
        "status": "ok",
        "database": "connected" if db_connected else "disconnected",
        "service": "mentora-backend",
        "version": settings.VERSION
    }

# Include API Routers
api_prefix = settings.API_V1_STR
app.include_router(auth.router, prefix=api_prefix)
app.include_router(profile.router, prefix=api_prefix)
app.include_router(goals.router, prefix=api_prefix)
app.include_router(skills.router, prefix=api_prefix)
app.include_router(courses.router, prefix=api_prefix)
app.include_router(recommendations.router, prefix=api_prefix)
app.include_router(learning_path.router, prefix=api_prefix)
app.include_router(progress.router, prefix=api_prefix)
app.include_router(assessments.router, prefix=api_prefix)
app.include_router(feedback.router, prefix=api_prefix)
app.include_router(tutor.router, prefix=api_prefix)
app.include_router(dashboard.router, prefix=api_prefix)

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "error": "INTERNAL_SERVER_ERROR",
            "message": "An unexpected error occurred while processing your request. Please try again."
        }
    )
