import { apiClient } from './client';

export interface DashboardData {
  greeting: string;
  overall_progress: number;
  current_streak: number;
  weekly_minutes: number;
  weekly_target_minutes: number;
  career_goal: string;
  target_date: string;
  today_plan: Array<{
    id: string;
    actionType: string;
    title: string;
    duration: string;
    progress: number;
    completed: boolean;
    category: string;
    linkedCourseId?: string;
    linkedProjectId?: string;
    linkedAssessmentId?: string;
  }>;
  continue_learning: {
    id: string;
    title: string;
    provider: string;
    currentLesson: string;
    progress: number;
    remainingMinutes: number;
    category: string;
  };
  skill_growth: Array<{
    name: string;
    level: number;
    target: number;
    gap: number;
    priority: string;
  }>;
  next_step: {
    title: string;
    type: string;
    estimatedHours: number;
    why: string;
    badge: string;
    actionText: string;
  };
  recent_achievements: Array<{
    id: string;
    name: string;
    description: string;
    icon: string;
    earned_at: string;
  }>;
  weekly_activity: Array<{
    day: string;
    minutes: number;
    target: number;
    topics: string[];
  }>;
}

export const dashboardApi = {
  getDashboard: async (): Promise<DashboardData> => {
    return apiClient<DashboardData>('/dashboard');
  },
};
