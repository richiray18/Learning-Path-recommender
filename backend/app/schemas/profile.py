from pydantic import BaseModel, Field
from typing import List, Optional

class ProfileUpdateRequest(BaseModel):
    name: Optional[str] = None
    experience_level: Optional[str] = "intermediate"
    daily_available_minutes: Optional[int] = 90
    learning_style: Optional[List[str]] = ["hands-on", "visual"]
    career_goal: Optional[str] = "Machine Learning Engineer"
    target_date: Optional[str] = "2027-04-30"
    bio: Optional[str] = None

class ProfileResponse(BaseModel):
    id: str
    user_id: str
    name: str
    email: str
    avatar: Optional[str] = None
    experience_level: str
    daily_available_minutes: int
    learning_style: List[str]
    career_goal: str
    target_date: str
    bio: Optional[str] = None
    current_streak: int
    overall_progress: int
    skills_developed_count: int
    total_skills_count: int
    completed_activities_count: int
    weekly_target_minutes: int
