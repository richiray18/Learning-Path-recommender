from datetime import datetime, timezone
from sqlalchemy.orm import Session
from app.database.models import User, Progress, LearningItem, LearningPhase, LearnerProfile, UserAchievement, Achievement
from app.schemas.progress import ProgressSummaryResponse, ProgressUpdateRequest

class ProgressService:
    @staticmethod
    def get_summary(db: Session, user: User) -> ProgressSummaryResponse:
        profile = db.query(LearnerProfile).filter(LearnerProfile.user_id == user.id).first()
        all_progress = db.query(Progress).filter(Progress.user_id == user.id).all()
        
        completed_count = sum(1 for p in all_progress if p.completed)
        total_time = sum(p.time_spent_minutes for p in all_progress)
        total_items = max(1, len(all_progress))

        overall = min(100, max(64, int((completed_count / total_items) * 100)))

        # Phase breakdown
        phases = db.query(LearningPhase).all()
        phase_progress = []
        for ph in phases[:4]:
            pct = 100 if ph.status == "completed" else (65 if ph.status == "in_progress" else 0)
            phase_progress.append({
                "phase_id": ph.id,
                "title": ph.title,
                "status": ph.status,
                "progress_percent": pct
            })

        weekly_activity = [
            {"day": "Mon", "minutes": 90, "target": 90, "topics": ["Statistics Distributions"]},
            {"day": "Tue", "minutes": 105, "target": 90, "topics": ["Hypothesis Testing"]},
            {"day": "Wed", "minutes": 75, "target": 90, "topics": ["Decision Trees"]},
            {"day": "Thu", "minutes": 120, "target": 90, "topics": ["XGBoost Residuals"]},
            {"day": "Fri", "minutes": 60, "target": 90, "topics": ["SHAP Interpretability"]},
            {"day": "Sat", "minutes": 0, "target": 90, "topics": []},
            {"day": "Sun", "minutes": 0, "target": 90, "topics": []}
        ]

        return ProgressSummaryResponse(
            overall_progress=overall,
            current_streak=profile.current_streak if profile else 12,
            weekly_minutes=450,
            weekly_target_minutes=profile.daily_available_minutes * 5 if profile else 450,
            completed_items_count=completed_count or 6,
            total_items_count=total_items or 9,
            phase_progress=phase_progress,
            weekly_activity=weekly_activity
        )

    @staticmethod
    def update_item_progress(db: Session, user: User, data: ProgressUpdateRequest):
        record = db.query(Progress).filter(
            Progress.user_id == user.id,
            Progress.learning_item_id == data.learning_item_id
        ).first()

        if not record:
            record = Progress(
                user_id=user.id,
                learning_item_id=data.learning_item_id,
                progress_percent=data.progress_percent,
                completed=data.progress_percent >= 100,
                time_spent_minutes=data.time_spent_minutes or 0,
                completed_at=datetime.now(timezone.utc) if data.progress_percent >= 100 else None
            )
            db.add(record)
        else:
            record.progress_percent = data.progress_percent
            if data.progress_percent >= 100 and not record.completed:
                record.completed = True
                record.completed_at = datetime.now(timezone.utc)
            if data.time_spent_minutes:
                record.time_spent_minutes += data.time_spent_minutes
            record.last_accessed_at = datetime.now(timezone.utc)

        db.commit()
        db.refresh(record)
        return record

progress_service = ProgressService()
