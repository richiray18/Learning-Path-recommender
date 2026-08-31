from fastapi import APIRouter, Depends
from pydantic import BaseModel
from typing import List, Optional
from app.services.gemini_service import gemini_service

router = APIRouter(prefix="/goals", tags=["Goals"])

class GoalAnalyzeRequest(BaseModel):
    goal: str

class GoalAnalyzeResponse(BaseModel):
    target_career: str
    required_skills: List[str]
    probable_prerequisites: List[str]
    estimated_learning_stages: List[str]
    recommended_milestones: List[str]
    ai_rationale: str

@router.post("/analyze", response_model=GoalAnalyzeResponse)
def analyze_goal(data: GoalAnalyzeRequest):
    prompt = f"""You are Mentora AI Learning Architect.
Analyze the following learner goal: '{data.goal}'

Return a structured JSON object with these exact keys:
{{
  "target_career": "Target role name",
  "required_skills": ["Skill 1", "Skill 2", "Skill 3", "Skill 4"],
  "probable_prerequisites": ["Prereq 1", "Prereq 2"],
  "estimated_learning_stages": ["Stage 1: Foundations", "Stage 2: Core Methods", "Stage 3: Specialization", "Stage 4: Production Deployment"],
  "recommended_milestones": ["Milestone 1", "Milestone 2", "Milestone 3"],
  "ai_rationale": "2-sentence pedagogical roadmap summary"
}}"""

    result = gemini_service.generate_structured_json(prompt)
    if not result:
        result = {
            "target_career": data.goal or "Machine Learning Engineer",
            "required_skills": ["Python", "Probability & Statistics", "Supervised ML", "Deep Learning", "FastAPI", "Docker"],
            "probable_prerequisites": ["Python Basics", "Linear Algebra", "Data Wrangling"],
            "estimated_learning_stages": [
                "Phase 1: Foundations & Statistical Inference",
                "Phase 2: Supervised Algorithms & Ensembles",
                "Phase 3: Deep Neural Architectures & PyTorch",
                "Phase 4: Production MLOps & Cloud APIs"
            ],
            "recommended_milestones": [
                "Statistical Diagnostic & Exploratory Baseline",
                "End-to-End Prediction Pipeline with XGBoost",
                "RAG Semantic Search System",
                "Cloud Run Deployed Model Microservice"
            ],
            "ai_rationale": f"Structured trajectory targeting {data.goal} with balanced mathematical rigor and production deployment capability."
        }

    return GoalAnalyzeResponse(**result)
