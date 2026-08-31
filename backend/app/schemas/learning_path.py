from pydantic import BaseModel
from typing import List, Optional, Any

class MilestoneSchema(BaseModel):
    title: str
    badge: str
    description: str
    completed: bool

class LearningPhaseResponse(BaseModel):
    id: str
    phase_number: int
    title: str
    timeframe: str
    original_timeframe: Optional[str] = None
    status: str
    description: Optional[str] = None
    is_adapted: bool
    adaptation_note: Optional[str] = None
    milestone: MilestoneSchema
    skills: List[str]
    course_ids: List[str]
    project_ids: List[str]
    assessment_ids: List[str]

class LearningPathResponse(BaseModel):
    id: str
    goal: str
    target_date: Optional[str] = None
    estimated_weeks: int
    status: str
    is_adapted: bool
    adaptation_reason: Optional[str] = None
    phases: List[LearningPhaseResponse]

class GeneratePathRequest(BaseModel):
    goal: str
    experience_level: str
    target_deadline: Optional[str] = "8 months"
    daily_availability: Optional[str] = "1.5 hours/day"
    learning_styles: Optional[List[str]] = ["Hands-on projects"]
    current_skills: Optional[List[str]] = []
