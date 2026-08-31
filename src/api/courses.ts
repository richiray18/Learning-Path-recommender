import { apiClient } from './client';

export interface CourseItem {
  id: string;
  title: string;
  description?: string;
  provider: string;
  difficulty: string;
  duration: string;
  duration_minutes: number;
  category: string;
  skills: string[];
  prerequisites: string[];
  rating: number;
  match_percentage?: number;
  status?: string;
  progress?: number;
  why_recommended?: string;
}

export interface ProjectItem {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  estimated_minutes: number;
  skills: string[];
  prerequisites: string[];
  deliverables: string[];
  status?: string;
  progress?: number;
  why_recommended?: string;
}

export const coursesApi = {
  getCourses: async (params?: { difficulty?: string; category?: string }): Promise<CourseItem[]> => {
    const query = new URLSearchParams();
    if (params?.difficulty) query.append('difficulty', params.difficulty);
    if (params?.category) query.append('category', params.category);
    const qs = query.toString();
    return apiClient<CourseItem[]>(`/courses${qs ? `?${qs}` : ''}`);
  },

  getProjects: async (): Promise<ProjectItem[]> => {
    return apiClient<ProjectItem[]>('/courses/projects');
  },
};
