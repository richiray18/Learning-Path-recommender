import uuid
from datetime import datetime, timezone
from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.database.models import User, Feedback
from app.api.auth import get_current_user
from app.schemas.feedback import FeedbackCreateRequest, FeedbackResponse
from app.services.adaptation_service import adaptation_service
from app.services.gemini_service import gemini_service

router = APIRouter(prefix="/feedback", tags=["Feedback"])

@router.post("", response_model=FeedbackResponse)
def submit_feedback(
    data: FeedbackCreateRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    ai_response = f"Thank you for sharing your feedback on '{data.resource_title}'. Mentora has calibrated your pacing and subsequent difficulty models accordingly."

    feedback_record = Feedback(
        id=str(uuid.uuid4()),
        user_id=current_user.id,
        learning_item_id=data.learning_item_id,
        resource_title=data.resource_title,
        difficulty_rating=data.difficulty_rating,
        usefulness_rating=data.usefulness_rating or 5,
        useful=data.useful if data.useful is not None else True,
        comment=data.comment,
        ai_response_text=ai_response
    )
    db.add(feedback_record)
    db.commit()

    adapt_res = adaptation_service.trigger_feedback_adaptation(
        db=db,
        user=current_user,
        resource_title=data.resource_title,
        difficulty_rating=data.difficulty_rating,
        useful=data.useful if data.useful is not None else True
    )

    return FeedbackResponse(
        id=feedback_record.id,
        resource_title=data.resource_title,
        difficulty_rating=data.difficulty_rating,
        usefulness_rating=data.usefulness_rating or 5,
        useful=data.useful if data.useful is not None else True,
        ai_response_text=ai_response,
        adaptation_triggered=adapt_res["adaptation_triggered"],
        adaptation_summary=adapt_res["summary"]
    )

@router.get("", response_model=List[FeedbackResponse])
def get_feedbacks(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    feedbacks = db.query(Feedback).filter(Feedback.user_id == current_user.id).order_by(Feedback.created_at.desc()).all()
    return [
        FeedbackResponse(
            id=f.id,
            resource_title=f.resource_title or "Module",
            difficulty_rating=f.difficulty_rating or "good",
            usefulness_rating=f.usefulness_rating or 5,
            useful=f.useful if f.useful is not None else True,
            ai_response_text=f.ai_response_text or "Calibrated to your feedback.",
            adaptation_triggered=False,
            adaptation_summary=None
        )
        for f in feedbacks
    ]
