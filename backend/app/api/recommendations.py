from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.database.models import User
from app.api.auth import get_current_user
from app.schemas.recommendation import RecommendationResponse, ExplainRecommendationResponse
from app.services.recommendation_service import recommendation_service

router = APIRouter(prefix="/recommendations", tags=["Recommendations"])

@router.get("", response_model=List[RecommendationResponse])
def get_recommendations(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return recommendation_service.get_recommendations(db, current_user)

@router.post("/{rec_id}/explain", response_model=ExplainRecommendationResponse)
def explain_recommendation(
    rec_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return recommendation_service.explain_recommendation(db, current_user, rec_id)
