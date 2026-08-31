from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.database.models import User
from app.api.auth import get_current_user
from app.schemas.progress import ProgressSummaryResponse, ProgressUpdateRequest, ProgressCompleteRequest
from app.services.progress_service import progress_service

router = APIRouter(prefix="/progress", tags=["Progress"])

@router.get("", response_model=ProgressSummaryResponse)
def get_progress(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return progress_service.get_summary(db, current_user)

@router.get("/summary", response_model=ProgressSummaryResponse)
def get_progress_summary(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return progress_service.get_summary(db, current_user)

@router.post("/update")
def update_progress(
    data: ProgressUpdateRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    progress_service.update_item_progress(db, current_user, data)
    return {"message": "Progress updated successfully"}

@router.post("/complete")
def complete_progress(
    data: ProgressCompleteRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    progress_service.update_item_progress(
        db, current_user,
        ProgressUpdateRequest(learning_item_id=data.learning_item_id, progress_percent=100, time_spent_minutes=data.time_spent_minutes)
    )
    return {"message": "Item marked as completed"}
