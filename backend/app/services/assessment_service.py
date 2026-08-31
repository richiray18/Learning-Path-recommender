from typing import List, Dict, Any
from datetime import datetime, timezone
from sqlalchemy.orm import Session
from app.database.models import User, Assessment, AssessmentResult, LearnerSkill, Progress
from app.schemas.assessment import AssessmentResponse, AssessmentSubmitResponse
from app.services.adaptation_service import adaptation_service
from app.services.gemini_service import gemini_service

class AssessmentService:
    @staticmethod
    def get_all_assessments(db: Session, user: User) -> List[AssessmentResponse]:
        assessments = db.query(Assessment).all()
        results = []
        user_results = {ar.assessment_id: ar for ar in db.query(AssessmentResult).filter(AssessmentResult.user_id == user.id).all()}

        for a in assessments:
            ar = user_results.get(a.id)
            results.append(AssessmentResponse(
                id=a.id,
                title=a.title,
                description=a.description,
                skill_id=a.skill_id,
                difficulty=a.difficulty,
                duration_minutes=a.duration_minutes,
                questions_count=len(a.questions or []),
                questions=a.questions or [],
                completed=ar is not None,
                score=ar.score if ar else None,
                ai_feedback=ar.feedback if ar else None
            ))
        return results

    @staticmethod
    def get_assessment(db: Session, assessment_id: str, user: User) -> AssessmentResponse:
        a = db.query(Assessment).filter(Assessment.id == assessment_id).first()
        if not a:
            raise ValueError("Assessment not found")

        ar = db.query(AssessmentResult).filter(
            AssessmentResult.user_id == user.id,
            AssessmentResult.assessment_id == a.id
        ).first()

        return AssessmentResponse(
            id=a.id,
            title=a.title,
            description=a.description,
            skill_id=a.skill_id,
            difficulty=a.difficulty,
            duration_minutes=a.duration_minutes,
            questions_count=len(a.questions or []),
            questions=a.questions or [],
            completed=ar is not None,
            score=ar.score if ar else None,
            ai_feedback=ar.feedback if ar else None
        )

    @staticmethod
    def submit_assessment(
        db: Session,
        user: User,
        assessment_id: str,
        answers: Dict[str, int]
    ) -> AssessmentSubmitResponse:
        a = db.query(Assessment).filter(Assessment.id == assessment_id).first()
        if not a:
            raise ValueError("Assessment not found")

        # Deterministic Score calculation
        questions = a.questions or []
        correct_count = 0
        total_questions = len(questions)

        for q in questions:
            q_id = str(q.get("id"))
            chosen = answers.get(q_id)
            if chosen is not None and chosen == q.get("correctIndex"):
                correct_count += 1

        score = round((correct_count / max(1, total_questions)) * 100, 1)
        passed = score >= 70

        # Qualitative feedback using Gemini if available
        skill_name = a.skill_id.replace("_", " ").title() if a.skill_id else "Machine Learning"
        ai_feedback = None

        prompt = f"""You are Mentora Learning Guide. Provide a warm, precise pedagogical feedback for learner {user.name} who just scored {score}% on '{a.title}' ({skill_name}).
Passed: {passed} ({correct_count}/{total_questions} questions correct).

Provide 2 sentences highlighting their command of the core mechanics and what to focus on next."""
        ai_feedback = gemini_service.generate_text(prompt)

        if not ai_feedback:
            if score >= 80:
                ai_feedback = f"Outstanding performance ({score}%)! You demonstrated deep command over {skill_name} mechanics and loss gradients. Mentora has accelerated your learning roadmap."
            else:
                ai_feedback = f"Good effort ({score}%). We have identified areas to strengthen in precision-recall calibration before advancing to deep neural networks."

        # Store assessment result in DB
        result = db.query(AssessmentResult).filter(
            AssessmentResult.user_id == user.id,
            AssessmentResult.assessment_id == assessment_id
        ).first()

        if not result:
            result = AssessmentResult(
                user_id=user.id,
                assessment_id=assessment_id,
                score=score,
                feedback=ai_feedback.strip(),
                answers=answers,
                completed_at=datetime.now(timezone.utc)
            )
            db.add(result)
        else:
            result.score = score
            result.feedback = ai_feedback.strip()
            result.answers = answers
            result.completed_at = datetime.now(timezone.utc)

        db.commit()

        # Trigger real adaptation & update learner skill
        adapt_res = adaptation_service.trigger_assessment_adaptation(
            db=db,
            user=user,
            assessment_id=assessment_id,
            skill_id=a.skill_id or "statistics",
            score=score
        )

        return AssessmentSubmitResponse(
            assessment_id=assessment_id,
            score=score,
            passed=passed,
            ai_feedback=ai_feedback.strip(),
            skill_updated=skill_name,
            new_skill_level=adapt_res["new_level"],
            adaptation_triggered=adapt_res["adaptation_triggered"],
            adaptation_reason=adapt_res["reason"]
        )

assessment_service = AssessmentService()
