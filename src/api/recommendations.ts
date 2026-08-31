import { apiClient } from './client';

export interface RecommendationItem {
  id: string;
  resource_type: string;
  resource_id: string;
  title: string;
  provider_or_type: string;
  difficulty: string;
  duration: string;
  match_percentage: number;
  score_breakdown: {
    goal_alignment: number;
    skill_gap_fit: number;
    prereq_fit: number;
    style_fit: number;
    difficulty_fit: number;
    time_fit: number;
  };
  reason: string;
  expected_gap_reduction: string;
  skills_gained: string[];
}

export interface ExplainRecommendationResponse {
  recommendation_id: string;
  resource_title: string;
  explanation: string;
  alignment_highlights: string[];
  skill_gap_addressed: string;
}

export const recommendationsApi = {
  getRecommendations: async (): Promise<RecommendationItem[]> => {
    return apiClient<RecommendationItem[]>('/recommendations');
  },

  explain: async (recId: string): Promise<ExplainRecommendationResponse> => {
    return apiClient<ExplainRecommendationResponse>(`/recommendations/${recId}/explain`, {
      method: 'POST',
    });
  },
};
