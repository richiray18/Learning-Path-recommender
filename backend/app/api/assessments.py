from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.database.models import User
from app.api.auth import get_current_user
from app.schemas.assessment import AssessmentResponse, AssessmentSubmitRequest, AssessmentSubmitResponse
from app.services.assessment_service import assessment_service

router = APIRouter(prefix="/assessments", tags=["Assessments"])

@router.get("", response_model=List[AssessmentResponse])
def get_assessments(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return assessment_service.get_all_assessments(db, current_user)

@router.get("/{assessment_id}", response_model=AssessmentResponse)
def get_assessment(
    assessment_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    try:
        return assessment_service.get_assessment(db, assessment_id, current_user)
    except ValueError:
        raise HTTPException(status_code=404, detail="Assessment not found")

@router.post("/{assessment_id}/submit", response_model=AssessmentSubmitResponse)
def submit_assessment(
    assessment_id: str,
    data: AssessmentSubmitRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    try:
        return assessment_service.submit_assessment(db, current_user, assessment_id, data.answers)
    except ValueError:
        raise HTTPException(status_code=404, detail="Assessment not found")
