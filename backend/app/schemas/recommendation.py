from pydantic import BaseModel
from typing import List, Optional

class RecommendationResponse(BaseModel):
    id: str
    resource_type: str
    resource_id: str
    title: str
    provider_or_type: str
    difficulty: str
    duration: str
    match_percentage: int
    score_breakdown: dict
    reason: str
    expected_gap_reduction: str
    skills_gained: List[str]

class ExplainRecommendationResponse(BaseModel):
    recommendation_id: str
    resource_title: str
    explanation: str
    alignment_highlights: List[str]
    skill_gap_addressed: str
