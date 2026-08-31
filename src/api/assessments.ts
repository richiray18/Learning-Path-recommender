import { apiClient } from './client';

export interface Question {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface AssessmentItem {
  id: string;
  title: string;
  description: string;
  skill_id: string;
  difficulty: string;
  duration_minutes: number;
  questions_count: number;
  questions: Question[];
  completed?: boolean;
  score?: number;
}

export interface AssessmentSubmitResult {
  assessment_id: string;
  score: number;
  passed: boolean;
  ai_feedback: string;
  skill_updated: string;
  new_skill_level: number;
  adaptation_triggered: boolean;
  adaptation_reason?: string;
}

export const assessmentsApi = {
  getAssessments: async (): Promise<AssessmentItem[]> => {
    return apiClient<AssessmentItem[]>('/assessments');
  },

  getAssessment: async (id: string): Promise<AssessmentItem> => {
    return apiClient<AssessmentItem>(`/assessments/${id}`);
  },

  submitAssessment: async (
    id: string,
    answers: Record<string, number>
  ): Promise<AssessmentSubmitResult> => {
    return apiClient<AssessmentSubmitResult>(`/assessments/${id}/submit`, {
      method: 'POST',
      body: JSON.stringify({ answers }),
    });
  },
};
