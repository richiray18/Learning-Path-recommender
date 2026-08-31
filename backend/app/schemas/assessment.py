from pydantic import BaseModel
from typing import List, Optional, Dict, Any

class QuestionOptionSchema(BaseModel):
    id: str
    question: str
    options: List[str]
    correct_index: Optional[int] = None
    explanation: Optional[str] = None

class AssessmentResponse(BaseModel):
    id: str
    title: str
    description: Optional[str] = None
    skill_id: Optional[str] = None
    difficulty: str
    duration_minutes: int
    questions_count: int
    questions: List[Dict[str, Any]]
    completed: bool
    score: Optional[float] = None
    ai_feedback: Optional[str] = None

class AssessmentSubmitRequest(BaseModel):
    answers: Dict[str, int]  # question_id -> chosen option index

class AssessmentSubmitResponse(BaseModel):
    assessment_id: str
    score: float
    passed: bool
    ai_feedback: str
    skill_updated: str
    new_skill_level: int
    adaptation_triggered: bool
    adaptation_reason: Optional[str] = None
