from pydantic import BaseModel
from typing import List, Optional, Dict, Any

class TutorChatRequest(BaseModel):
    message: str
    context: Optional[Dict[str, Any]] = None

class TutorChatResponse(BaseModel):
    message_id: str
    role: str = "ai"
    text: str
    timestamp: str
    context_used: Optional[Dict[str, Any]] = None

class ChatHistoryItem(BaseModel):
    id: str
    sender: str
    text: str
    timestamp: str
