import { apiClient } from './client';

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user_id: string;
  name: string;
  email: string;
}

export interface UserMe {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export const authApi = {
  login: async (email: string, password: string): Promise<AuthResponse> => {
    const res = await apiClient<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    if (res.access_token) {
      localStorage.setItem('mentora_token', res.access_token);
    }
    return res;
  },

  register: async (data: {
    name: string;
    email: string;
    password: string;
    experience_level?: string;
    career_goal?: string;
  }): Promise<AuthResponse> => {
    const res = await apiClient<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    if (res.access_token) {
      localStorage.setItem('mentora_token', res.access_token);
    }
    return res;
  },

  getMe: async (): Promise<UserMe> => {
    return apiClient<UserMe>('/auth/me');
  },

  logout: async (): Promise<void> => {
    try {
      await apiClient('/auth/logout', { method: 'POST' });
    } finally {
      localStorage.removeItem('mentora_token');
    }
  },
};
