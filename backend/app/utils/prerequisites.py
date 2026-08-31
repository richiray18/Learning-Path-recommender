from typing import List, Dict, Tuple

PREREQUISITE_DEPENDENCY_GRAPH = {
    "python": [],
    "sql": [],
    "statistics": [],
    "data_structures": ["python"],
    "pandas": ["python"],
    "numpy": ["python"],
    "machine_learning": ["python", "statistics", "numpy"],
    "model_evaluation": ["machine_learning", "statistics"],
    "feature_engineering": ["pandas", "machine_learning"],
    "deep_learning": ["machine_learning", "numpy"],
    "nlp": ["deep_learning"],
    "transformers": ["deep_learning", "nlp"],
    "computer_vision": ["deep_learning"],
    "vector_databases": ["transformers"],
    "fastapi": ["python"],
    "docker": ["fastapi"],
    "mlops": ["docker", "model_evaluation"],
    "cloud": ["docker"],
    "monitoring": ["mlops"]
}

def check_prerequisites_met(
    target_skill_or_course_reqs: List[str],
    user_skill_levels: Dict[str, int],
    minimum_threshold: int = 50
) -> Tuple[bool, List[str], str]:
    """
    Evaluates whether a learner has met the prerequisites for a skill or course.
    Returns: (is_ready, missing_skills, explanatory_message)
    """
    missing = []
    for req in target_skill_or_course_reqs:
        req_norm = req.lower().replace(" ", "_").replace("&", "").replace("-", "_")
        # Check standard graph or user skills dictionary
        matched_level = 0
        for skill_id, level in user_skill_levels.items():
            if req_norm in skill_id or skill_id in req_norm:
                matched_level = level
                break

        if matched_level < minimum_threshold:
            missing.append(f"{req} (Current: {matched_level}%, Req: {minimum_threshold}%)")

    if not missing:
        return True, [], "All prerequisite competencies verified."

    reason = f"Recommended to complete {', '.join(missing)} before starting this advanced module."
    return False, missing, reason
