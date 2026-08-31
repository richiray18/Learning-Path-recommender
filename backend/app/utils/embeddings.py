import math
from typing import List, Dict, Any

def compute_keyword_similarity(text_a: str, text_b: str) -> float:
    """
    Fast and robust deterministic similarity matching based on token overlap.
    Acts as zero-dependency semantic fallback when vector engines are offline.
    """
    tokens_a = set(text_a.lower().replace("-", " ").replace("_", " ").split())
    tokens_b = set(text_b.lower().replace("-", " ").replace("_", " ").split())
    
    if not tokens_a or not tokens_b:
        return 0.5

    intersection = tokens_a.intersection(tokens_b)
    union = tokens_a.union(tokens_b)

    return round(len(intersection) / len(union), 3) if union else 0.0

def cosine_similarity(vec_a: List[float], vec_b: List[float]) -> float:
    if not vec_a or not vec_b or len(vec_a) != len(vec_b):
        return 0.0
    dot = sum(a * b for a, b in zip(vec_a, vec_b))
    norm_a = math.sqrt(sum(a * a for a in vec_a))
    norm_b = math.sqrt(sum(b * b for b in vec_b))
    if norm_a == 0 or norm_b == 0:
        return 0.0
    return dot / (norm_a * norm_b)
