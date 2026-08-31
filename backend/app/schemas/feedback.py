from pydantic import BaseModel
from typing import Optional

class FeedbackCreateRequest(BaseModel):
    learning_item_id: Optional[str] = None
    resource_title: str
    difficulty_rating: str  # too_easy, good, okay, too_difficult
    usefulness_rating: Optional[int] = 5
    useful: Optional[bool] = True
    comment: Optional[str] = None

class FeedbackResponse(BaseModel):
    id: str
    resource_title: str
    difficulty_rating: str
    usefulness_rating: int
    useful: bool
    ai_response_text: str
    adaptation_triggered: bool
    adaptation_summary: Optional[str] = None
