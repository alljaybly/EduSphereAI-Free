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

// User preferences
export const userPreferencesAPI = {
  async get(userId: string) {
    return apiRequest(`/api/user-preferences/${userId}`);
  },

  async update(preferences: any) {
    return apiRequest('/api/user-preferences', {
      method: 'POST',
      body: JSON.stringify(preferences),
    });
  },
};

// User progress
export const userProgressAPI = {
  async get(userId: string, subject?: string, grade?: string) {
    const params = new URLSearchParams();
    if (subject) params.append('subject', subject);
    if (grade) params.append('grade', grade);
    
    const query = params.toString() ? `?${params.toString()}` : '';
    return apiRequest(`/api/user-progress/${userId}${query}`);
  },

  async update(progress: any) {
    return apiRequest('/api/user-progress', {
      method: 'POST',
      body: JSON.stringify(progress),
    });
  },
};

// User achievements
export const userAchievementsAPI = {
  async get(userId: string) {
    return apiRequest(`/api/user-achievements/${userId}`);
  },

  async award(achievement: any) {
    return apiRequest('/api/user-achievements', {
      method: 'POST',
      body: JSON.stringify(achievement),
    });
  },
};

// Shared content
export const sharedContentAPI = {
  async get(limit = 20) {
    return apiRequest(`/api/shared-content?limit=${limit}`);
  },

  async share(content: any) {
    return apiRequest('/api/shared-content', {
      method: 'POST',
      body: JSON.stringify(content),
    });
  },
};

// Tutor scripts
export const tutorScriptsAPI = {
  async get(filters: { tone?: string; grade?: string; subject?: string } = {}) {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value);
    });
    
    const query = params.toString() ? `?${params.toString()}` : '';
    return apiRequest(`/api/tutor-scripts${query}`);
  },

  async save(script: any) {
    return apiRequest('/api/tutor-scripts', {
      method: 'POST',
      body: JSON.stringify(script),
    });
  },
};

// Coding problems
export const codingProblemsAPI = {
  async get(language?: string, difficulty?: string) {
    const params = new URLSearchParams();
    if (language) params.append('language', language);
    if (difficulty) params.append('difficulty', difficulty);
    
    const query = params.toString() ? `?${params.toString()}` : '';
    return apiRequest(`/api/coding-problems${query}`);
  },

  async save(problem: any) {
    return apiRequest('/api/coding-problems', {
      method: 'POST',
      body: JSON.stringify(problem),
    });
  },
};

// AR problems
export const arProblemsAPI = {
  async get(subject?: string, grade?: string) {
    const params = new URLSearchParams();
    if (subject) params.append('subject', subject);
    if (grade) params.append('grade', grade);
    
    const query = params.toString() ? `?${params.toString()}` : '';
    return apiRequest(`/api/ar-problems${query}`);
  },

  async save(problem: any) {
    return apiRequest('/api/ar-problems', {
      method: 'POST',
      body: JSON.stringify(problem),
    });
  },
};

// Stories
export const storiesAPI = {
  async get(language?: string, gradeLevel?: string) {
    const params = new URLSearchParams();
    if (language) params.append('language', language);
    if (gradeLevel) params.append('gradeLevel', gradeLevel);
    
    const query = params.toString() ? `?${params.toString()}` : '';
    return apiRequest(`/api/stories${query}`);
  },

  async save(story: any) {
    return apiRequest('/api/stories', {
      method: 'POST',
      body: JSON.stringify(story),
    });
  },
};

// Voice quizzes
export const voiceQuizzesAPI = {
  async get(language?: string, difficulty?: string, subject?: string) {
    const params = new URLSearchParams();
    if (language) params.append('language', language);
    if (difficulty) params.append('difficulty', difficulty);
    if (subject) params.append('subject', subject);
    
    const query = params.toString() ? `?${params.toString()}` : '';
    return apiRequest(`/api/voice-quizzes${query}`);
  },

  async save(quiz: any) {
    return apiRequest('/api/voice-quizzes', {
      method: 'POST',
      body: JSON.stringify(quiz),
    });
  },
};

// Collaborative sessions
export const collaborativeSessionsAPI = {
  async get(sessionId: string) {
    return apiRequest(`/api/collaborative-sessions/${sessionId}`);
  },

  async create(session: any) {
    return apiRequest('/api/collaborative-sessions', {
      method: 'POST',
      body: JSON.stringify(session),
    });
  },

  async update(sessionId: string, updates: any) {
    return apiRequest(`/api/collaborative-sessions/${sessionId}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
  },

  async getParticipants(sessionId: string) {
    return apiRequest(`/api/collaborative-sessions/${sessionId}/participants`);
  },

  async addParticipant(sessionId: string, participant: any) {
    return apiRequest(`/api/collaborative-sessions/${sessionId}/participants`, {
      method: 'POST',
      body: JSON.stringify(participant),
    });
  },

  async getMessages(sessionId: string) {
    return apiRequest(`/api/collaborative-sessions/${sessionId}/messages`);
  },

  async sendMessage(sessionId: string, message: any) {
    return apiRequest(`/api/collaborative-sessions/${sessionId}/messages`, {
      method: 'POST',
      body: JSON.stringify(message),
    });
  },
};

// Legacy compatibility layer - provides the same interface as supabaseHelpers
export const supabaseHelpers = {
  /**
   * Get user preferences with defaults
   */
  async getUserPreferences(userId: string) {
    try {
      return await userPreferencesAPI.get(userId);
    } catch (error) {
      console.error('Error fetching user preferences:', error);
      // Return defaults if fetch fails
      return {
        user_id: userId,
        preferred_subject: 'math',
        preferred_difficulty: 2,
        preferred_language: 'en',
        learning_style: 'visual',
        daily_goal_minutes: 30
      };
    }
  },

  /**
   * Update user preferences
   */
  async updateUserPreferences(preferences: any) {
    try {
      await userPreferencesAPI.update(preferences);
      return true;
    } catch (error) {
      console.error('Error updating user preferences:', error);
      return false;
    }
  },

  /**
   * Get user achievements
   */
  async getUserAchievements(userId: string) {
    try {
      return await userAchievementsAPI.get(userId);
    } catch (error) {
      console.error('Error fetching user achievements:', error);
      return [];
    }
  },

  /**
   * Award achievement to user
   */
  async awardAchievement(achievement: any) {
    try {
      await userAchievementsAPI.award(achievement);
      return true;
    } catch (error) {
      console.error('Error awarding achievement:', error);
      return false;
    }
  },

  /**
   * Get shared content
   */
  async getSharedContent(limit = 20) {
    try {
      return await sharedContentAPI.get(limit);
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
      const result = await sharedContentAPI.share(content);
      return result.id || null;
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
      return await tutorScriptsAPI.get(filters);
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
      const result = await tutorScriptsAPI.save(script);
      return result.id || null;
    } catch (error) {
      console.error('Error saving tutor script:', error);
      return null;
    }
  }
};

// Export specific APIs
export {
  userPreferencesAPI,
  userProgressAPI,
  userAchievementsAPI,
  sharedContentAPI,
  tutorScriptsAPI,
  codingProblemsAPI,
  arProblemsAPI,
  storiesAPI,
  voiceQuizzesAPI,
  collaborativeSessionsAPI,
};

// Default export for compatibility
export default {
  supabaseHelpers,
  userPreferencesAPI,
  userProgressAPI,
  userAchievementsAPI,
  sharedContentAPI,
  tutorScriptsAPI,
  codingProblemsAPI,
  arProblemsAPI,
  storiesAPI,
  voiceQuizzesAPI,
  collaborativeSessionsAPI,
};