import { apiClient } from './client';

export interface ProgressSummary {
  overall_progress: number;
  current_streak: number;
  weekly_minutes: number;
  weekly_target_minutes: number;
  completed_items_count: number;
  total_items_count: number;
  phase_progress: Array<{
    phase_id: string;
    title: string;
    status: string;
    progress_percent: number;
  }>;
  weekly_activity: Array<{
    day: string;
    minutes: number;
    target: number;
    topics: string[];
  }>;
}

export const progressApi = {
  getSummary: async (): Promise<ProgressSummary> => {
    return apiClient<ProgressSummary>('/progress/summary');
  },

  updateProgress: async (learningItemId: string, progressPercent: number, timeSpentMinutes?: number) => {
    return apiClient('/progress/update', {
      method: 'POST',
      body: JSON.stringify({
        learning_item_id: learningItemId,
        progress_percent: progressPercent,
        time_spent_minutes: timeSpentMinutes,
      }),
    });
  },
};
