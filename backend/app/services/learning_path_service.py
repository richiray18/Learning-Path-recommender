from typing import Optional
from sqlalchemy.orm import Session
from app.database.models import User, LearningPath, LearningPhase, LearningItem, Course, Project, Assessment
from app.schemas.learning_path import LearningPathResponse, LearningPhaseResponse, MilestoneSchema, GeneratePathRequest

class LearningPathService:
    @staticmethod
    def get_current_path(db: Session, user: User) -> Optional[LearningPathResponse]:
        lp = db.query(LearningPath).filter(
            LearningPath.user_id == user.id,
            LearningPath.status == "active"
        ).first()
        
        if not lp:
            return None

        phases_resp = []
        for ph in lp.phases:
            # Query items
            course_ids = [item.resource_id for item in ph.items if item.type == "course"]
            project_ids = [item.resource_id for item in ph.items if item.type == "project"]
            assessment_ids = [item.resource_id for item in ph.items if item.type == "assessment"]

            skills_list = []
            if ph.phase_number == 1:
                skills_list = ["Python", "Probability & Statistics", "Pandas", "NumPy"]
            elif ph.phase_number == 2:
                skills_list = ["Supervised ML", "Tree Ensembles", "Cross-Validation", "SHAP"]
            elif ph.phase_number == 3:
                skills_list = ["Deep Learning", "PyTorch", "Transformers", "Vector Search"]
            else:
                skills_list = ["FastAPI", "Docker", "MLOps", "Model Monitoring"]

            milestone_data = ph.milestone or {
                "title": f"Phase {ph.phase_number} Milestone",
                "badge": f"Phase {ph.phase_number} Badge",
                "description": "Demonstrate practical competency.",
                "completed": ph.status == "completed"
            }

            phases_resp.append(LearningPhaseResponse(
                id=ph.id,
                phase_number=ph.phase_number,
                title=ph.title,
                timeframe=ph.timeframe,
                original_timeframe=ph.original_timeframe,
                status=ph.status,
                description=ph.description,
                is_adapted=ph.is_adapted or False,
                adaptation_note=ph.adaptation_note,
                milestone=MilestoneSchema(**milestone_data),
                skills=skills_list,
                course_ids=course_ids or ["c-statistics-core"],
                project_ids=project_ids or ["p-churn-predictor"],
                assessment_ids=assessment_ids or ["a-stats-check"]
            ))

        return LearningPathResponse(
            id=lp.id,
            goal=lp.goal,
            target_date=lp.target_date,
            estimated_weeks=lp.estimated_weeks,
            status=lp.status,
            is_adapted=lp.is_adapted or False,
            adaptation_reason=lp.adaptation_reason,
            phases=phases_resp
        )

    @staticmethod
    def generate_path(db: Session, user: User, data: GeneratePathRequest) -> LearningPathResponse:
        # Check existing active paths and archive them
        existing = db.query(LearningPath).filter(LearningPath.user_id == user.id, LearningPath.status == "active").all()
        for ep in existing:
            ep.status = "archived"

        lp = LearningPath(
            user_id=user.id,
            goal=data.goal,
            target_date="2027-04-30",
            estimated_weeks=32,
            status="active",
            is_adapted=False,
            adaptation_reason=f"Tailored for {data.experience_level} baseline with daily dedication of {data.daily_availability}."
        )
        db.add(lp)
        db.flush()

        # Create structured phases
        p1 = LearningPhase(
            learning_path_id=lp.id, phase_number=1,
            title=f"Statistical Foundations & Core Architecture for {data.goal}",
            description="Bridge essential prerequisite math, data structures, and statistical fluency.",
            timeframe="Weeks 1–6", status="in_progress", order_index=1,
            milestone={"title": "Statistical Diagnostic & Feature Baseline", "badge": "Foundation Master", "description": "Demonstrate mastery in probability and feature pipelines.", "completed": False}
        )
        p2 = LearningPhase(
            learning_path_id=lp.id, phase_number=2,
            title=f"Applied Algorithms & Performance Tuning for {data.goal}",
            description="Master supervised algorithms, ensemble gradient boosting, and evaluation metrics.",
            timeframe="Weeks 7–14", status="upcoming", order_index=2,
            milestone={"title": "End-to-End Prediction Classifier", "badge": "Applied Practitioner", "description": "Construct and validate a calibrated ensemble model.", "completed": False}
        )
        p3 = LearningPhase(
            learning_path_id=lp.id, phase_number=3,
            title=f"Deep Learning & Advanced Specialization",
            description="Neural networks, autograd mechanics, transformer attention, and vector search.",
            timeframe="Weeks 15–24", status="upcoming", order_index=3,
            milestone={"title": "RAG Assistant with Vector Indexing", "badge": "Deep Learning Builder", "description": "Build high-speed semantic retrieval systems.", "completed": False}
        )
        p4 = LearningPhase(
            learning_path_id=lp.id, phase_number=4,
            title=f"Production Deployment, CI/CD & Scaling",
            description="FastAPI APIs, Docker containerization, and monitoring.",
            timeframe="Weeks 25–32", status="upcoming", order_index=4,
            milestone={"title": "Live Cloud Run Microservice", "badge": "Production Engineer", "description": "Ship automated CI/CD prediction pipelines.", "completed": False}
        )
        db.add_all([p1, p2, p3, p4])
        db.commit()

        return LearningPathService.get_current_path(db, user)

learning_path_service = LearningPathService()
