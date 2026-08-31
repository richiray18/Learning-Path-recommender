from pydantic import BaseModel
from typing import List, Optional, Any

class LessonItemSchema(BaseModel):
    title: str
    duration: str
    completed: Optional[bool] = False

class CourseResponse(BaseModel):
    id: str
    title: str
    description: str
    provider: str
    difficulty: str
    duration: str
    duration_minutes: int
    category: str
    skills: List[str]
    prerequisites: List[str]
    rating: float
    lessons: List[LessonItemSchema]
    match_percentage: Optional[int] = 90
    status: Optional[str] = "not_started"
    progress: Optional[int] = 0
    why_recommended: Optional[str] = None

class ProjectResponse(BaseModel):
    id: str
    title: str
    description: str
    difficulty: str
    estimated_minutes: int
    skills: List[str]
    prerequisites: List[str]
    deliverables: List[str]
    status: Optional[str] = "Up Next"
    progress: Optional[int] = 0
    why_recommended: Optional[str] = None
