from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.database.models import User
from app.api.auth import get_current_user
from app.schemas.tutor import TutorChatRequest, TutorChatResponse, ChatHistoryItem
from app.services.tutor_service import tutor_service

router = APIRouter(prefix="/tutor", tags=["Tutor"])

@router.post("/chat", response_model=TutorChatResponse)
def chat_with_tutor(
    data: TutorChatRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return tutor_service.chat(db, current_user, data)

@router.get("/history", response_model=List[ChatHistoryItem])
def get_chat_history(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return tutor_service.get_history(db, current_user)
