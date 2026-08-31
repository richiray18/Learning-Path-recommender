from pydantic import BaseModel, EmailStr
from typing import Optional

class UserRegisterRequest(BaseModel):
    name: str
    email: EmailStr
    password: str
    experience_level: Optional[str] = "intermediate"
    career_goal: Optional[str] = "Machine Learning Engineer"

class UserLoginRequest(BaseModel):
    email: EmailStr
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user_id: str
    name: str
    email: str

class UserMeResponse(BaseModel):
    id: str
    name: str
    email: str
    avatar: Optional[str] = None
