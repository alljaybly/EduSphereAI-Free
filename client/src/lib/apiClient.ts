/**
 * API Client for EduSphere AI
 * Replaces Supabase client calls with server-side PostgreSQL API
 * Provides the same interface as Supabase helpers for seamless migration
 */

const API_BASE = '';

// Helper function for making API requests
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE}${endpoint}`;
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || `HTTP ${response.status}`);
  }

  return response.json();
}

// Supabase-compatible helpers for seamless migration
export const supabaseHelpers = {
  /**
   * Get user preferences
   */
  async getUserPreferences(userId: string) {
    try {
      return await apiRequest(`/api/user-preferences/${userId}`);
    } catch (error) {
      console.error('Error fetching user preferences:', error);
      return null;
    }
  },

  /**
   * Update user preferences
   */
  async updateUserPreferences(preferences: any) {
    try {
      return await apiRequest('/api/user-preferences', {
        method: 'POST',
        body: JSON.stringify(preferences),
      });
    } catch (error) {
      console.error('Error updating user preferences:', error);
      return null;
    }
  },

  /**
   * Get user progress
   */
  async getUserProgress(userId: string, subject?: string, grade?: string) {
    try {
      const params = new URLSearchParams();
      if (subject) params.append('subject', subject);
      if (grade) params.append('grade', grade);
      
      const query = params.toString() ? `?${params.toString()}` : '';
      return await apiRequest(`/api/user-progress/${userId}${query}`);
    } catch (error) {
      console.error('Error fetching user progress:', error);
      return [];
    }
  },

  /**
   * Update user progress
   */
  async updateUserProgress(progress: any) {
    try {
      return await apiRequest('/api/user-progress', {
        method: 'POST',
        body: JSON.stringify(progress),
      });
    } catch (error) {
      console.error('Error updating user progress:', error);
      return null;
    }
  },

  /**
   * Get user achievements
   */
  async getUserAchievements(userId: string) {
    try {
      return await apiRequest(`/api/user-achievements/${userId}`);
    } catch (error) {
      console.error('Error fetching user achievements:', error);
      return [];
    }
  },

  /**
   * Award achievement
   */
  async awardAchievement(achievement: any) {
    try {
      return await apiRequest('/api/user-achievements', {
        method: 'POST',
        body: JSON.stringify(achievement),
      });
    } catch (error) {
      console.error('Error awarding achievement:', error);
      return null;
    }
  },

  /**
   * Get shared content
   */
  async getSharedContent(limit = 20) {
    try {
      return await apiRequest(`/api/shared-content?limit=${limit}`);
    } catch (error) {
      console.error('Error fetching shared content:', error);
      return [];
    }
  },

  /**
   * Share content
   */
  async shareContent(content: any) {
    try {
      return await apiRequest('/api/shared-content', {
        method: 'POST',
        body: JSON.stringify(content),
      });
    } catch (error) {
      console.error('Error sharing content:', error);
      return null;
    }
  },

  /**
   * Get tutor scripts
   */
  async getTutorScripts(filters: { tone?: string; grade?: string; subject?: string } = {}) {
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
      
      const query = params.toString() ? `?${params.toString()}` : '';
      return await apiRequest(`/api/tutor-scripts${query}`);
    } catch (error) {
      console.error('Error fetching tutor scripts:', error);
      return [];
    }
  },

  /**
   * Save tutor script
   */
  async saveTutorScript(script: any) {
    try {
      return await apiRequest('/api/tutor-scripts', {
        method: 'POST',
        body: JSON.stringify(script),
      });
    } catch (error) {
      console.error('Error saving tutor script:', error);
      return null;
    }
  },

  /**
   * Get coding problems
   */
  async getCodingProblems(language?: string, difficulty?: string) {
    try {
      const params = new URLSearchParams();
      if (language) params.append('language', language);
      if (difficulty) params.append('difficulty', difficulty);
      
      const query = params.toString() ? `?${params.toString()}` : '';
      return await apiRequest(`/api/coding-problems${query}`);
    } catch (error) {
      console.error('Error fetching coding problems:', error);
      return [];
    }
  },

  /**
   * Save coding problem
   */
  async saveCodingProblem(problem: any) {
    try {
      return await apiRequest('/api/coding-problems', {
        method: 'POST',
        body: JSON.stringify(problem),
      });
    } catch (error) {
      console.error('Error saving coding problem:', error);
      return null;
    }
  },

  /**
   * Get AR problems
   */
  async getARProblems(subject?: string, grade?: string) {
    try {
      const params = new URLSearchParams();
      if (subject) params.append('subject', subject);
      if (grade) params.append('grade', grade);
      
      const query = params.toString() ? `?${params.toString()}` : '';
      return await apiRequest(`/api/ar-problems${query}`);
    } catch (error) {
      console.error('Error fetching AR problems:', error);
      return [];
    }
  },

  /**
   * Save AR problem
   */
  async saveARProblem(problem: any) {
    try {
      return await apiRequest('/api/ar-problems', {
        method: 'POST',
        body: JSON.stringify(problem),
      });
    } catch (error) {
      console.error('Error saving AR problem:', error);
      return null;
    }
  },

  /**
   * Get stories
   */
  async getStories(language?: string, gradeLevel?: string) {
    try {
      const params = new URLSearchParams();
      if (language) params.append('language', language);
      if (gradeLevel) params.append('grade_level', gradeLevel);
      
      const query = params.toString() ? `?${params.toString()}` : '';
      return await apiRequest(`/api/stories${query}`);
    } catch (error) {
      console.error('Error fetching stories:', error);
      return [];
    }
  },

  /**
   * Save story
   */
  async saveStory(story: any) {
    try {
      return await apiRequest('/api/stories', {
        method: 'POST',
        body: JSON.stringify(story),
      });
    } catch (error) {
      console.error('Error saving story:', error);
      return null;
    }
  },

  /**
   * Get voice quizzes
   */
  async getVoiceQuizzes(language?: string, difficulty?: string, subject?: string) {
    try {
      const params = new URLSearchParams();
      if (language) params.append('language', language);
      if (difficulty) params.append('difficulty', difficulty);
      if (subject) params.append('subject', subject);
      
      const query = params.toString() ? `?${params.toString()}` : '';
      return await apiRequest(`/api/voice-quizzes${query}`);
    } catch (error) {
      console.error('Error fetching voice quizzes:', error);
      return [];
    }
  },

  /**
   * Save voice quiz
   */
  async saveVoiceQuiz(quiz: any) {
    try {
      return await apiRequest('/api/voice-quizzes', {
        method: 'POST',
        body: JSON.stringify(quiz),
      });
    } catch (error) {
      console.error('Error saving voice quiz:', error);
      return null;
    }
  },

  /**
   * Get collaborative session
   */
  async getCollaborativeSession(sessionId: string) {
    try {
      return await apiRequest(`/api/collaborative-sessions/${sessionId}`);
    } catch (error) {
      console.error('Error fetching collaborative session:', error);
      return null;
    }
  },

  /**
   * Create collaborative session
   */
  async createCollaborativeSession(session: any) {
    try {
      return await apiRequest('/api/collaborative-sessions', {
        method: 'POST',
        body: JSON.stringify(session),
      });
    } catch (error) {
      console.error('Error creating collaborative session:', error);
      return null;
    }
  },

  /**
   * Update collaborative session
   */
  async updateCollaborativeSession(sessionId: string, updates: any) {
    try {
      return await apiRequest(`/api/collaborative-sessions/${sessionId}`, {
        method: 'PUT',
        body: JSON.stringify(updates),
      });
    } catch (error) {
      console.error('Error updating collaborative session:', error);
      return null;
    }
  },

  /**
   * Get session participants
   */
  async getSessionParticipants(sessionId: string) {
    try {
      return await apiRequest(`/api/session-participants/${sessionId}`);
    } catch (error) {
      console.error('Error fetching session participants:', error);
      return [];
    }
  },

  /**
   * Add session participant
   */
  async addSessionParticipant(participant: any) {
    try {
      return await apiRequest('/api/session-participants', {
        method: 'POST',
        body: JSON.stringify(participant),
      });
    } catch (error) {
      console.error('Error adding session participant:', error);
      return null;
    }
  },

  /**
   * Get chat messages
   */
  async getChatMessages(sessionId: string) {
    try {
      return await apiRequest(`/api/chat-messages/${sessionId}`);
    } catch (error) {
      console.error('Error fetching chat messages:', error);
      return [];
    }
  },

  /**
   * Save chat message
   */
  async saveChatMessage(message: any) {
    try {
      return await apiRequest('/api/chat-messages', {
        method: 'POST',
        body: JSON.stringify(message),
      });
    } catch (error) {
      console.error('Error saving chat message:', error);
      return null;
    }
  }
};

// Export default for compatibility
export default supabaseHelpers;