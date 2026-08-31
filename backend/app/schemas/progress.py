from pydantic import BaseModel
from typing import List, Optional

class ProgressUpdateRequest(BaseModel):
    learning_item_id: str
    progress_percent: int
    time_spent_minutes: Optional[int] = 0

class ProgressCompleteRequest(BaseModel):
    learning_item_id: str
    time_spent_minutes: Optional[int] = 0

class ProgressSummaryResponse(BaseModel):
    overall_progress: int
    current_streak: int
    weekly_minutes: int
    weekly_target_minutes: int
    completed_items_count: int
    total_items_count: int
    phase_progress: List[dict]
    weekly_activity: List[dict]
