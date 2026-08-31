import uuid
from datetime import datetime, timezone
from sqlalchemy import (
    Column, String, Integer, Float, Boolean, Text, ForeignKey,
    DateTime, JSON, Table
)
from sqlalchemy.orm import relationship
from app.database.database import Base

def generate_uuid() -> str:
    return str(uuid.uuid4())

def get_utc_now():
    return datetime.now(timezone.utc)

class User(Base):
    __tablename__ = "users"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    name = Column(String(255), nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    avatar = Column(String(500), nullable=True)
    created_at = Column(DateTime, default=get_utc_now)
    updated_at = Column(DateTime, default=get_utc_now, onupdate=get_utc_now)

    # Relationships
    profile = relationship("LearnerProfile", back_populates="user", uselist=False, cascade="all, delete-orphan")
    skills = relationship("LearnerSkill", back_populates="user", cascade="all, delete-orphan")
    assessment_results = relationship("AssessmentResult", back_populates="user", cascade="all, delete-orphan")
    learning_paths = relationship("LearningPath", back_populates="user", cascade="all, delete-orphan")
    progress_records = relationship("Progress", back_populates="user", cascade="all, delete-orphan")
    feedbacks = relationship("Feedback", back_populates="user", cascade="all, delete-orphan")
    recommendations = relationship("Recommendation", back_populates="user", cascade="all, delete-orphan")
    achievements = relationship("UserAchievement", back_populates="user", cascade="all, delete-orphan")
    chat_messages = relationship("ChatMessage", back_populates="user", cascade="all, delete-orphan")


class LearnerProfile(Base):
    __tablename__ = "learner_profiles"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)
    experience_level = Column(String(50), default="intermediate")  # beginner, intermediate, advanced
    daily_available_minutes = Column(Integer, default=90)
    learning_style = Column(JSON, default=list)  # ["hands-on", "visual", "interactive"]
    career_goal = Column(String(255), default="Machine Learning Engineer")
    target_date = Column(String(50), default="2027-04-30")
    bio = Column(Text, nullable=True)
    current_streak = Column(Integer, default=12)
    created_at = Column(DateTime, default=get_utc_now)
    updated_at = Column(DateTime, default=get_utc_now, onupdate=get_utc_now)

    user = relationship("User", back_populates="profile")


class Skill(Base):
    __tablename__ = "skills"

    id = Column(String(50), primary_key=True)  # e.g., 'python', 'statistics'
    name = Column(String(100), nullable=False)
    category = Column(String(50), nullable=False)  # Foundation, Core ML, Advanced, Deployment
    description = Column(Text, nullable=True)
    icon = Column(String(50), nullable=True)

    learner_skills = relationship("LearnerSkill", back_populates="skill")


class LearnerSkill(Base):
    __tablename__ = "learner_skills"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    skill_id = Column(String(50), ForeignKey("skills.id"), nullable=False)
    current_level = Column(Integer, default=0)  # 0 to 100
    target_level = Column(Integer, default=85)  # 0 to 100
    confidence = Column(Float, default=0.7)
    priority = Column(String(20), default="Medium")  # High, Medium, Low
    why_it_matters = Column(Text, nullable=True)
    ai_insight = Column(Text, nullable=True)
    last_assessed_at = Column(DateTime, default=get_utc_now)

    user = relationship("User", back_populates="skills")
    skill = relationship("Skill", back_populates="learner_skills")


class Course(Base):
    __tablename__ = "courses"

    id = Column(String(50), primary_key=True)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    provider = Column(String(100), default="Mentora Academy")
    url = Column(String(500), nullable=True)
    difficulty = Column(String(50), default="Intermediate")
    duration_minutes = Column(Integer, default=180)
    category = Column(String(100), default="Core")
    skills = Column(JSON, default=list)  # ["Python", "Statistics"]
    prerequisites = Column(JSON, default=list)  # ["Python Basics"]
    rating = Column(Float, default=4.8)
    lessons = Column(JSON, default=list)  # [{"title": "...", "duration": "15m"}]
    created_at = Column(DateTime, default=get_utc_now)


class Project(Base):
    __tablename__ = "projects"

    id = Column(String(50), primary_key=True)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    difficulty = Column(String(50), default="Intermediate")
    estimated_minutes = Column(Integer, default=360)
    skills = Column(JSON, default=list)
    prerequisites = Column(JSON, default=list)
    deliverables = Column(JSON, default=list)
    created_at = Column(DateTime, default=get_utc_now)


class Assessment(Base):
    __tablename__ = "assessments"

    id = Column(String(50), primary_key=True)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    skill_id = Column(String(50), ForeignKey("skills.id"), nullable=True)
    difficulty = Column(String(50), default="Intermediate")
    duration_minutes = Column(Integer, default=20)
    questions = Column(JSON, default=list)  # [{"id": 1, "question": "...", "options": [], "correctIndex": 0, "explanation": "..."}]
    created_at = Column(DateTime, default=get_utc_now)

    results = relationship("AssessmentResult", back_populates="assessment")


class AssessmentResult(Base):
    __tablename__ = "assessment_results"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    assessment_id = Column(String(50), ForeignKey("assessments.id"), nullable=False)
    score = Column(Float, nullable=False)  # 0 to 100
    feedback = Column(Text, nullable=True)
    answers = Column(JSON, default=dict)
    completed_at = Column(DateTime, default=get_utc_now)

    user = relationship("User", back_populates="assessment_results")
    assessment = relationship("Assessment", back_populates="results")


class LearningPath(Base):
    __tablename__ = "learning_paths"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    goal = Column(String(255), nullable=False)
    target_date = Column(String(50), nullable=True)
    estimated_weeks = Column(Integer, default=32)
    status = Column(String(50), default="active")  # active, completed, archived
    is_adapted = Column(Boolean, default=False)
    adaptation_reason = Column(Text, nullable=True)
    created_at = Column(DateTime, default=get_utc_now)
    updated_at = Column(DateTime, default=get_utc_now, onupdate=get_utc_now)

    user = relationship("User", back_populates="learning_paths")
    phases = relationship("LearningPhase", back_populates="learning_path", cascade="all, delete-orphan", order_by="LearningPhase.order_index")


class LearningPhase(Base):
    __tablename__ = "learning_phases"

    id = Column(String(50), primary_key=True, default=generate_uuid)
    learning_path_id = Column(String(36), ForeignKey("learning_paths.id", ondelete="CASCADE"), nullable=False)
    phase_number = Column(Integer, default=1)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    order_index = Column(Integer, default=0)
    timeframe = Column(String(50), default="Weeks 1-6")
    original_timeframe = Column(String(50), nullable=True)
    estimated_weeks = Column(Integer, default=6)
    status = Column(String(50), default="in_progress")  # completed, in_progress, upcoming, locked
    is_adapted = Column(Boolean, default=False)
    adaptation_note = Column(Text, nullable=True)
    milestone = Column(JSON, default=dict)  # {"title": "...", "badge": "...", "description": "...", "completed": False}

    learning_path = relationship("LearningPath", back_populates="phases")
    items = relationship("LearningItem", back_populates="phase", cascade="all, delete-orphan", order_by="LearningItem.order_index")


class LearningItem(Base):
    __tablename__ = "learning_items"

    id = Column(String(50), primary_key=True, default=generate_uuid)
    phase_id = Column(String(50), ForeignKey("learning_phases.id", ondelete="CASCADE"), nullable=False)
    type = Column(String(50), nullable=False)  # course, project, assessment
    resource_id = Column(String(50), nullable=False)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    order_index = Column(Integer, default=0)
    estimated_minutes = Column(Integer, default=60)
    status = Column(String(50), default="not_started")  # not_started, in_progress, completed, locked

    phase = relationship("LearningPhase", back_populates="items")
    progress = relationship("Progress", back_populates="item", cascade="all, delete-orphan")
    feedbacks = relationship("Feedback", back_populates="item", cascade="all, delete-orphan")


class Progress(Base):
    __tablename__ = "progress"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    learning_item_id = Column(String(50), ForeignKey("learning_items.id", ondelete="CASCADE"), nullable=False)
    progress_percent = Column(Integer, default=0)  # 0 to 100
    completed = Column(Boolean, default=False)
    time_spent_minutes = Column(Integer, default=0)
    last_accessed_at = Column(DateTime, default=get_utc_now)
    completed_at = Column(DateTime, nullable=True)

    user = relationship("User", back_populates="progress_records")
    item = relationship("LearningItem", back_populates="progress")


class Feedback(Base):
    __tablename__ = "feedback"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    learning_item_id = Column(String(50), ForeignKey("learning_items.id", ondelete="CASCADE"), nullable=True)
    resource_title = Column(String(255), nullable=True)
    difficulty_rating = Column(String(50), default="good")  # too_easy, good, okay, too_difficult
    usefulness_rating = Column(Integer, default=5)  # 1 to 5
    useful = Column(Boolean, default=True)
    comment = Column(Text, nullable=True)
    ai_response_text = Column(Text, nullable=True)
    created_at = Column(DateTime, default=get_utc_now)

    user = relationship("User", back_populates="feedbacks")
    item = relationship("LearningItem", back_populates="feedbacks")


class Recommendation(Base):
    __tablename__ = "recommendations"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    resource_type = Column(String(50), default="course")  # course, project
    resource_id = Column(String(50), nullable=False)
    score = Column(Float, default=90.0)  # 0 to 100
    reason = Column(Text, nullable=True)
    goal_score = Column(Float, default=5.0)
    gap_score = Column(Float, default=5.0)
    prereq_score = Column(Float, default=5.0)
    style_score = Column(Float, default=5.0)
    time_score = Column(Float, default=5.0)
    dismissed = Column(Boolean, default=False)
    created_at = Column(DateTime, default=get_utc_now)

    user = relationship("User", back_populates="recommendations")


class Achievement(Base):
    __tablename__ = "achievements"

    id = Column(String(50), primary_key=True)
    name = Column(String(100), nullable=False)
    description = Column(Text, nullable=False)
    icon = Column(String(50), default="award")
    criteria = Column(String(255), nullable=True)


class UserAchievement(Base):
    __tablename__ = "user_achievements"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    achievement_id = Column(String(50), ForeignKey("achievements.id"), nullable=False)
    earned_at = Column(DateTime, default=get_utc_now)

    user = relationship("User", back_populates="achievements")
    achievement = relationship("Achievement")


class ChatMessage(Base):
    __tablename__ = "chat_messages"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    role = Column(String(20), nullable=False)  # user or ai
    message = Column(Text, nullable=False)
    context_data = Column(JSON, nullable=True)
    created_at = Column(DateTime, default=get_utc_now)

    user = relationship("User", back_populates="chat_messages")
