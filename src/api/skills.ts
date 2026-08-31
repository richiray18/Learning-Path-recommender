import { apiClient } from './client';

export interface SkillItem {
  id: string;
  name: string;
  category: string;
  current_level: number;
  target_level: number;
  gap: number;
  priority: string;
  why_it_matters: string;
  ai_insight: string;
  status: string;
}

export const skillsApi = {
  getSkills: async (): Promise<SkillItem[]> => {
    return apiClient<SkillItem[]>('/skills');
  },
  analyzeSkills: async (goal: string, currentSkills: Record<string, number>) => {
    return apiClient('/skills/analyze', {
      method: 'POST',
      body: JSON.stringify({ goal, current_skills: currentSkills }),
    });
  },
};
