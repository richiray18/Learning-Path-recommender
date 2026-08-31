from typing import List
from sqlalchemy.orm import Session
from app.database.models import User, LearnerSkill, Skill
from app.schemas.skill import SkillGapResponse, SkillAnalyzeRequest, SkillAnalyzeResponse

class SkillService:
    @staticmethod
    def get_user_skills(db: Session, user: User) -> List[SkillGapResponse]:
        learner_skills = db.query(LearnerSkill).filter(LearnerSkill.user_id == user.id).all()
        results = []
        for ls in learner_skills:
            gap = max(0, ls.target_level - ls.current_level)
            status = "Mastered" if ls.current_level >= 90 else ("Proficient" if ls.current_level >= 75 else ("Improving" if ls.current_level >= 50 else "Critical Gap"))
            skill_name = ls.skill.name if ls.skill else ls.skill_id.replace("_", " ").title()
            category = ls.skill.category if ls.skill else "Core ML"
            results.append(SkillGapResponse(
                id=ls.skill_id,
                name=skill_name,
                category=category,
                current_level=ls.current_level,
                target_level=ls.target_level,
                gap=gap,
                priority=ls.priority or ("High" if gap > 30 else "Medium"),
                why_it_matters=ls.why_it_matters or f"Essential competency for achieving target performance benchmarks.",
                ai_insight=ls.ai_insight or f"Paced learning modules prioritized in active roadmap.",
                status=status
            ))
        return results

    @staticmethod
    def analyze_skills(db: Session, data: SkillAnalyzeRequest) -> SkillAnalyzeResponse:
        all_skills = db.query(Skill).all()
        results = []
        critical_count = 0
        
        goal_lower = data.goal.lower()
        for s in all_skills:
            is_relevant = (
                s.name.lower() in goal_lower or
                s.category.lower() in ["foundation", "core ml"] or
                s.id in ["python", "statistics", "machine_learning", "deep_learning"]
            )
            if is_relevant:
                is_known = any(cs.lower() in s.name.lower() or s.id in cs.lower() for cs in data.current_skills)
                cur_level = 65 if is_known else 20
                target_level = 85
                gap = target_level - cur_level
                if gap > 40:
                    critical_count += 1
                status = "Improving" if cur_level >= 50 else "Critical Gap"
                results.append(SkillGapResponse(
                    id=s.id,
                    name=s.name,
                    category=s.category,
                    current_level=cur_level,
                    target_level=target_level,
                    gap=gap,
                    priority="High" if gap > 35 else "Medium",
                    why_it_matters=s.description or f"Required competency for {data.goal}.",
                    ai_insight="Targeted module added to curriculum.",
                    status=status
                ))
        return SkillAnalyzeResponse(
            goal=data.goal,
            skills=results,
            critical_gaps_count=critical_count,
            projected_study_hours=critical_count * 25 + 40
        )

skill_service = SkillService()
