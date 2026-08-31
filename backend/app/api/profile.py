from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.database.models import User
from app.api.auth import get_current_user
from app.schemas.profile import ProfileResponse, ProfileUpdateRequest
from app.services.profile_service import profile_service

router = APIRouter(prefix="/profile", tags=["Profile"])

@router.get("", response_model=ProfileResponse)
def get_profile(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return profile_service.get_or_create_profile(db, current_user)

@router.put("", response_model=ProfileResponse)
def update_profile(
    data: ProfileUpdateRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return profile_service.update_profile(db, current_user, data)
