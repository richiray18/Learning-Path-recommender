def calculate_recommendation_score(
    goal_alignment: float,  # 0 to 5
    skill_gap_fit: float,   # 0 to 5
    prereq_fit: float,      # 0 to 5
    style_fit: float,       # 0 to 5
    difficulty_fit: float,  # 0 to 5
    time_fit: float         # 0 to 5
) -> dict:
    """
    Multi-factor transparent scoring model:
    - Goal Relevance: 30%
    - Skill Gap Target: 25%
    - Prerequisite Readiness: 20%
    - Learning Style Match: 10%
    - Difficulty Fit: 10%
    - Time Availability Fit: 5%
    Total normalized to 0 - 100%.
    """
    w_goal = 0.30
    w_gap = 0.25
    w_prereq = 0.20
    w_style = 0.10
    w_diff = 0.10
    w_time = 0.05

    # Each input is 0-5. Max raw = 5.0
    weighted_sum = (
        (goal_alignment * w_goal) +
        (skill_gap_fit * w_gap) +
        (prereq_fit * w_prereq) +
        (style_fit * w_style) +
        (difficulty_fit * w_diff) +
        (time_fit * w_time)
    )

    score_percent = round((weighted_sum / 5.0) * 100)
    score_percent = max(10, min(99, score_percent))

    return {
        "final_score": score_percent,
        "factors": {
            "goal_alignment": round(goal_alignment, 1),
            "skill_gap_fit": round(skill_gap_fit, 1),
            "prereq_fit": round(prereq_fit, 1),
            "style_fit": round(style_fit, 1),
            "difficulty_fit": round(difficulty_fit, 1),
            "time_fit": round(time_fit, 1)
        }
    }
