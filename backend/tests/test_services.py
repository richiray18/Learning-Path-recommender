import pytest
from app.utils.scoring import calculate_recommendation_score
from app.utils.prerequisites import check_prerequisites_met

def test_recommendation_scoring():
    result = calculate_recommendation_score(
        goal_alignment=5.0,
        skill_gap_fit=5.0,
        prereq_fit=5.0,
        style_fit=5.0,
        difficulty_fit=5.0,
        time_fit=5.0
    )
    assert result["final_score"] >= 95
    assert "factors" in result

def test_prerequisite_engine():
    user_skills = {"python": 85, "statistics": 45}
    is_ready, missing, reason = check_prerequisites_met(["python", "statistics"], user_skills, minimum_threshold=50)
    assert not is_ready
    assert len(missing) == 1
    assert "statistics" in missing[0].lower()
