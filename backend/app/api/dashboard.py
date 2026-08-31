from datetime import datetime, timezone
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.database.models import User, LearnerProfile, LearnerSkill, Progress, Course, UserAchievement, Achievement, LearningPhase
from app.api.auth import get_current_user
from app.services.skill_service import skill_service
from app.services.progress_service import progress_service

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])

@router.get("")
def get_dashboard_data(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    profile = db.query(LearnerProfile).filter(LearnerProfile.user_id == current_user.id).first()
    first_name = current_user.name.split(" ")[0] if current_user.name else "Learner"

    skills = skill_service.get_user_skills(db, current_user)
    prog_summary = progress_service.get_summary(db, current_user)

    # Fetch achievements
    user_achs = db.query(UserAchievement).filter(UserAchievement.user_id == current_user.id).limit(4).all()
    achievements_list = []
    for ua in user_achs:
        if ua.achievement:
            achievements_list.append({
                "id": ua.achievement.id,
                "name": ua.achievement.name,
                "description": ua.achievement.description,
                "icon": ua.achievement.icon,
                "earned_at": ua.earned_at.strftime("%b %d") if ua.earned_at else "Recently"
            })

    # Today's plan
    today_plan = [
        {
            "id": "dp-1",
            "actionType": "Complete",
            "title": "Lesson 4: Regularization & Shrinkage in XGBoost",
            "duration": "35 min",
            "progress": 60,
            "completed": False,
            "category": "Core ML",
            "linkedCourseId": "c-ml-ensembles"
        },
        {
            "id": "dp-2",
            "actionType": "Practice",
            "title": "Jupyter Lab: Calibrating Classification Thresholds",
            "duration": "45 min",
            "progress": 0,
            "completed": False,
            "category": "Hands-on Lab",
            "linkedProjectId": "p-churn-predictor"
        },
        {
            "id": "dp-3",
            "actionType": "Review",
            "title": "Flashcards: Bayes Theorem & Posterior Odds",
            "duration": "10 min",
            "progress": 100,
            "completed": True,
            "category": "Foundation",
            "linkedAssessmentId": "a-stats-check"
        }
    ]

    continue_learning = {
        "id": "c-ml-ensembles",
        "title": "Tree Ensembles, XGBoost & LightGBM Mastery",
        "provider": "Mentora Academy",
        "currentLesson": "Lesson 4 of 6: Gradient Boosting Residuals & Regularization",
        "progress": 60,
        "remainingMinutes": 45,
        "category": "Core ML"
    }

    next_step = {
        "title": "Customer Churn Prediction Engine",
        "type": "Portfolio Project",
        "estimatedHours": 8,
        "why": "Synthesizes Phase 2 XGBoost classification and SHAP value explainability.",
        "badge": "Ensemble Builder",
        "actionText": "Continue Project"
    }

    return {
        "greeting": f"Good evening, {first_name}",
        "overall_progress": prog_summary.overall_progress,
        "current_streak": prog_summary.current_streak,
        "weekly_minutes": prog_summary.weekly_minutes,
        "weekly_target_minutes": prog_summary.weekly_target_minutes,
        "career_goal": profile.career_goal if profile else "Machine Learning Engineer",
        "target_date": profile.target_date if profile else "2027-04-30",
        "today_plan": today_plan,
        "continue_learning": continue_learning,
        "skill_growth": [
            {"name": s.name, "level": s.current_level, "target": s.target_level, "gap": s.gap, "priority": s.priority}
            for s in skills
        ],
        "next_step": next_step,
        "recent_achievements": achievements_list,
        "weekly_activity": prog_summary.weekly_activity
    }
