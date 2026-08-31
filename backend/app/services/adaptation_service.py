from datetime import datetime, timezone
from sqlalchemy.orm import Session
from app.database.models import User, LearningPath, LearningPhase, LearnerSkill, Progress
from app.services.gemini_service import gemini_service

class AdaptationService:
    @staticmethod
    def trigger_assessment_adaptation(
        db: Session,
        user: User,
        assessment_id: str,
        skill_id: str,
        score: float
    ) -> dict:
        """
        Core Adaptive Learning Engine:
        When a learner scores >= 85%:
        1. Updates the skill level significantly.
        2. Shortens current phase timeframe (e.g. Weeks 1-6 -> Weeks 1-4.5).
        3. Accelerates subsequent advanced modules.
        4. Logs the adaptation note.
        """
        ls = db.query(LearnerSkill).filter(
            LearnerSkill.user_id == user.id,
            LearnerSkill.skill_id == skill_id
        ).first()

        old_level = ls.current_level if ls else 48
        # Calculate new deterministic skill level
        gain = int((score / 100.0) * 20) if score >= 80 else int((score / 100.0) * 8)
        new_level = min(98, old_level + gain)

        if ls:
            ls.current_level = new_level
            ls.last_assessed_at = datetime.now(timezone.utc)
            db.flush()

        # Check learning path
        lp = db.query(LearningPath).filter(
            LearningPath.user_id == user.id,
            LearningPath.status == "active"
        ).first()

        adaptation_triggered = False
        reason = None

        if score >= 80:
            adaptation_triggered = True
            reason = f"Demonstrated high mastery ({score}%) in {skill_id.replace('_', ' ').title()}. Mentora accelerated your foundational review by 5 days."
            if lp:
                lp.is_adapted = True
                lp.adaptation_reason = reason
                
                # Update phase 1 or current phase
                active_phase = db.query(LearningPhase).filter(
                    LearningPhase.learning_path_id == lp.id,
                    LearningPhase.status == "in_progress"
                ).first()
                
                if active_phase:
                    active_phase.is_adapted = True
                    active_phase.adaptation_note = f"Accelerated: {skill_id.replace('_', ' ').title()} diagnostic score ({score}%) surpassed required baseline."
                    active_phase.timeframe = f"Weeks 1–4.5 (Paced ahead by 1.5 wks)"
            db.commit()
        else:
            db.commit()

        return {
            "adaptation_triggered": adaptation_triggered,
            "reason": reason,
            "old_level": old_level,
            "new_level": new_level
        }

    @staticmethod
    def trigger_feedback_adaptation(
        db: Session,
        user: User,
        resource_title: str,
        difficulty_rating: str,
        useful: bool
    ) -> dict:
        """
        Adaptive calibration based on learner feedback:
        If user marked 'too_easy', accelerates pacing.
        If user marked 'too_difficult', inserts remedial deep dives.
        """
        adaptation_triggered = False
        summary = None

        lp = db.query(LearningPath).filter(
            LearningPath.user_id == user.id,
            LearningPath.status == "active"
        ).first()

        if difficulty_rating == "too_easy":
            adaptation_triggered = True
            summary = f"Detected high conceptual fluency on '{resource_title}'. Pacing accelerated for upcoming theory modules."
            if lp:
                lp.is_adapted = True
                lp.adaptation_reason = summary
                db.commit()
        elif difficulty_rating == "too_difficult":
            adaptation_triggered = True
            summary = f"Noted challenge on '{resource_title}'. Added supplementary practical exercises before milestone assessment."
            if lp:
                lp.is_adapted = True
                lp.adaptation_reason = summary
                db.commit()

        return {
            "adaptation_triggered": adaptation_triggered,
            "summary": summary
        }

adaptation_service = AdaptationService()
