import { apiClient } from './client';

export interface FeedbackData {
  resource_title: string;
  difficulty_rating: string;
  usefulness_rating?: number;
  useful?: boolean;
  comment?: string;
  learning_item_id?: string;
}

export interface FeedbackResponse {
  id: string;
  resource_title: string;
  difficulty_rating: string;
  usefulness_rating: number;
  useful: boolean;
  ai_response_text: string;
  adaptation_triggered: boolean;
  adaptation_summary?: string;
}

export const feedbackApi = {
  submitFeedback: async (data: FeedbackData): Promise<FeedbackResponse> => {
    return apiClient<FeedbackResponse>('/feedback', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  getFeedbacks: async (): Promise<FeedbackResponse[]> => {
    return apiClient<FeedbackResponse[]>('/feedback');
  },
};
