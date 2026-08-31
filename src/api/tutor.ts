import { apiClient } from './client';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
}

export interface TutorResponse {
  message_id: string;
  role: string;
  text: string;
  timestamp: string;
  context_used?: any;
}

export const tutorApi = {
  sendMessage: async (message: string, context?: any): Promise<TutorResponse> => {
    return apiClient<TutorResponse>('/tutor/chat', {
      method: 'POST',
      body: JSON.stringify({ message, context }),
    });
  },

  getHistory: async (): Promise<ChatMessage[]> => {
    return apiClient<ChatMessage[]>('/tutor/history');
  },
};
