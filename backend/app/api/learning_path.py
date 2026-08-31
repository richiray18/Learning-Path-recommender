from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.database.models import User
from app.api.auth import get_current_user
from app.schemas.learning_path import LearningPathResponse, GeneratePathRequest
from app.services.learning_path_service import learning_path_service

router = APIRouter(prefix="/learning-path", tags=["Learning Path"])

@router.get("/current", response_model=LearningPathResponse)
def get_current_learning_path(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    path = learning_path_service.get_current_path(db, current_user)
    if not path:
        # Auto-generate baseline path if none exists
        return learning_path_service.generate_path(
            db, current_user,
            GeneratePathRequest(goal="Machine Learning Engineer", experience_level="intermediate")
        )
    return path

@router.post("/generate", response_model=LearningPathResponse)
def generate_learning_path(
    data: GeneratePathRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return learning_path_service.generate_path(db, current_user, data)

@router.post("/regenerate", response_model=LearningPathResponse)
def regenerate_learning_path(
    data: GeneratePathRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return learning_path_service.generate_path(db, current_user, data)
