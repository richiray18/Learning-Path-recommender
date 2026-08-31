from pydantic import BaseModel
from typing import List, Optional

class SkillGapResponse(BaseModel):
    id: str
    name: str
    category: str
    current_level: int
    target_level: int
    gap: int
    priority: str
    why_it_matters: Optional[str] = None
    ai_insight: Optional[str] = None
    status: str

class SkillAnalyzeRequest(BaseModel):
    goal: str
    current_skills: List[str]
    experience_level: Optional[str] = "intermediate"

class SkillAnalyzeResponse(BaseModel):
    goal: str
    skills: List[SkillGapResponse]
    critical_gaps_count: int
    projected_study_hours: int
