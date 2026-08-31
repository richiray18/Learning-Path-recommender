import { apiClient } from './client';

export interface Milestone {
  title: string;
  badge: string;
  description: string;
  completed: boolean;
}

export interface Phase {
  id: string;
  phaseNumber: number;
  title: string;
  timeframe: string;
  originalTimeframe?: string;
  status: 'completed' | 'in_progress' | 'upcoming';
  description: string;
  isAdapted?: boolean;
  adaptationNote?: string;
  milestone: Milestone;
  skills: string[];
  courseIds: string[];
  projectIds: string[];
  assessmentIds: string[];
}

export interface LearningPathData {
  id: string;
  goal: string;
  targetDate: string;
  estimatedWeeks: number;
  status: string;
  isAdapted?: boolean;
  adaptationReason?: string;
  phases: Phase[];
}

export const learningPathApi = {
  getCurrentPath: async (): Promise<LearningPathData> => {
    return apiClient<LearningPathData>('/learning-path/current');
  },

  generatePath: async (data: {
    goal: string;
    experience_level?: string;
    target_deadline?: string;
  }): Promise<LearningPathData> => {
    return apiClient<LearningPathData>('/learning-path/generate', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};
