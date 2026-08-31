from typing import List, Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.database.models import Course, Project
from app.schemas.course import CourseResponse, ProjectResponse

router = APIRouter(prefix="/courses", tags=["Courses"])

@router.get("", response_model=List[CourseResponse])
def get_courses(
    difficulty: Optional[str] = None,
    category: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(Course)
    if difficulty:
        query = query.filter(Course.difficulty.ilike(f"%{difficulty}%"))
    if category:
        query = query.filter(Course.category.ilike(f"%{category}%"))
    
    courses = query.all()
    results = []
    for c in courses:
        results.append(CourseResponse(
            id=c.id,
            title=c.title,
            description=c.description,
            provider=c.provider,
            difficulty=c.difficulty,
            duration=f"{round(c.duration_minutes / 60, 1)} hours",
            duration_minutes=c.duration_minutes,
            category=c.category,
            skills=c.skills or [],
            prerequisites=c.prerequisites or [],
            rating=c.rating,
            lessons=c.lessons or [],
            match_percentage=92 if "Supervised" in c.title or "Statistics" in c.title else 85,
            status="in_progress" if "Ensembles" in c.title else ("completed" if "Statistical" in c.title else "not_started"),
            progress=60 if "Ensembles" in c.title else (100 if "Statistical" in c.title else 0),
            why_recommended=f"Curated to elevate your competency in {', '.join(c.skills[:2])}."
        ))
    return results

@router.get("/search", response_model=List[CourseResponse])
def search_courses(
    q: str = Query("", description="Search term"),
    difficulty: Optional[str] = None,
    skill: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(Course)
    if q:
        query = query.filter(
            Course.title.ilike(f"%{q}%") |
            Course.description.ilike(f"%{q}%") |
            Course.category.ilike(f"%{q}%")
        )
    if difficulty:
        query = query.filter(Course.difficulty.ilike(f"%{difficulty}%"))

    courses = query.all()
    results = []
    for c in courses:
        results.append(CourseResponse(
            id=c.id,
            title=c.title,
            description=c.description,
            provider=c.provider,
            difficulty=c.difficulty,
            duration=f"{round(c.duration_minutes / 60, 1)} hours",
            duration_minutes=c.duration_minutes,
            category=c.category,
            skills=c.skills or [],
            prerequisites=c.prerequisites or [],
            rating=c.rating,
            lessons=c.lessons or []
        ))
    return results

@router.get("/projects", response_model=List[ProjectResponse])
def get_projects(db: Session = Depends(get_db)):
    projects = db.query(Project).all()
    return [
        ProjectResponse(
            id=p.id,
            title=p.title,
            description=p.description,
            difficulty=p.difficulty,
            estimated_minutes=p.estimated_minutes,
            skills=p.skills or [],
            prerequisites=p.prerequisites or [],
            deliverables=p.deliverables or [],
            status="In Progress" if "Churn" in p.title else "Up Next",
            progress=45 if "Churn" in p.title else 0,
            why_recommended="High-yield portfolio piece directly showcasing applied model evaluation."
        )
        for p in projects
    ]
