from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.database.models import User, Skill
from app.api.auth import get_current_user
from app.schemas.skill import SkillGapResponse, SkillAnalyzeRequest, SkillAnalyzeResponse
from app.services.skill_service import skill_service

router = APIRouter(prefix="/skills", tags=["Skills"])

@router.get("", response_model=List[SkillGapResponse])
def get_all_skills(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return skill_service.get_user_skills(db, current_user)

@router.get("/me", response_model=List[SkillGapResponse])
def get_my_skills(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return skill_service.get_user_skills(db, current_user)

@router.post("/analyze", response_model=SkillAnalyzeResponse)
def analyze_skills(
    data: SkillAnalyzeRequest,
    db: Session = Depends(get_db)
):
    return skill_service.analyze_skills(db, data)
