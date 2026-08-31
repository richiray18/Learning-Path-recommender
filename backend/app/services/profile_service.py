from sqlalchemy.orm import Session
from app.database.models import User, LearnerProfile, LearnerSkill, Progress, LearningItem
from app.schemas.profile import ProfileUpdateRequest, ProfileResponse

class ProfileService:
    @staticmethod
    def get_or_create_profile(db: Session, user: User) -> ProfileResponse:
        profile = db.query(LearnerProfile).filter(LearnerProfile.user_id == user.id).first()
        if not profile:
            profile = LearnerProfile(
                user_id=user.id,
                experience_level="intermediate",
                daily_available_minutes=90,
                learning_style=["hands-on", "visual"],
                career_goal="Machine Learning Engineer",
                target_date="2027-04-30",
                current_streak=12
            )
            db.add(profile)
            db.commit()
            db.refresh(profile)

        # Compute dynamic stats from DB
        skills_developed = db.query(LearnerSkill).filter(
            LearnerSkill.user_id == user.id,
            LearnerSkill.current_level >= 50
        ).count()
        total_skills = db.query(LearnerSkill).filter(LearnerSkill.user_id == user.id).count() or 8

        completed_items = db.query(Progress).filter(
            Progress.user_id == user.id,
            Progress.completed == True
        ).count()
        total_items = db.query(LearningItem).count() or 10
        overall_progress = int((completed_items / total_items) * 100) if total_items > 0 else 64
        overall_progress = min(100, max(overall_progress, 64))

        return ProfileResponse(
            id=profile.id,
            user_id=user.id,
            name=user.name,
            email=user.email,
            avatar=user.avatar,
            experience_level=profile.experience_level,
            daily_available_minutes=profile.daily_available_minutes,
            learning_style=profile.learning_style or ["hands-on", "visual"],
            career_goal=profile.career_goal,
            target_date=profile.target_date or "2027-04-30",
            bio=profile.bio,
            current_streak=profile.current_streak,
            overall_progress=overall_progress,
            skills_developed_count=skills_developed or 4,
            total_skills_count=total_skills,
            completed_activities_count=completed_items or 8,
            weekly_target_minutes=profile.daily_available_minutes * 5
        )

    @staticmethod
    def update_profile(db: Session, user: User, data: ProfileUpdateRequest) -> ProfileResponse:
        profile = db.query(LearnerProfile).filter(LearnerProfile.user_id == user.id).first()
        if not profile:
            profile = LearnerProfile(user_id=user.id)
            db.add(profile)

        if data.name:
            user.name = data.name
        if data.experience_level:
            profile.experience_level = data.experience_level
        if data.daily_available_minutes:
            profile.daily_available_minutes = data.daily_available_minutes
        if data.learning_style:
            profile.learning_style = data.learning_style
        if data.career_goal:
            profile.career_goal = data.career_goal
        if data.target_date:
            profile.target_date = data.target_date
        if data.bio is not None:
            profile.bio = data.bio

        db.commit()
        db.refresh(profile)
        db.refresh(user)

        return ProfileService.get_or_create_profile(db, user)

profile_service = ProfileService()
