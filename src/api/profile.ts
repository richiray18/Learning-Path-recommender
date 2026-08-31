import { apiClient } from './client';

export interface ProfileData {
  id: string;
  user_id: string;
  name: string;
  email: string;
  avatar?: string;
  experience_level: string;
  daily_available_minutes: number;
  learning_style: string[];
  career_goal: string;
  target_date: string;
  bio?: string;
  current_streak: number;
  overall_progress: number;
  skills_developed_count: number;
  total_skills_count: number;
  completed_activities_count: number;
  weekly_target_minutes: number;
}

export const profileApi = {
  getProfile: async (): Promise<ProfileData> => {
    return apiClient<ProfileData>('/profile');
  },

  updateProfile: async (data: Partial<ProfileData>): Promise<ProfileData> => {
    return apiClient<ProfileData>('/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },
};
