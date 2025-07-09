import { db } from "./db";
import { eq, and, desc } from "drizzle-orm";
import {
  users,
  userPreferences,
  userProgress,
  userAchievements,
  sharedContent,
  tutorScripts,
  codingProblems,
  arProblems,
  stories,
  voiceQuizzes,
  collaborativeSessions,
  sessionParticipants,
  chatMessages,
  type User,
  type InsertUser,
  type UserPreferences,
  type InsertUserPreferences,
  type UserProgress,
  type InsertUserProgress,
  type UserAchievements,
  type InsertUserAchievements,
  type SharedContent,
  type InsertSharedContent,
  type TutorScripts,
  type InsertTutorScripts,
  type CodingProblems,
  type InsertCodingProblems,
  type ARProblems,
  type InsertARProblems,
  type Stories,
  type InsertStories,
  type VoiceQuizzes,
  type InsertVoiceQuizzes,
  type CollaborativeSessions,
  type InsertCollaborativeSessions,
  type SessionParticipants,
  type InsertSessionParticipants,
  type ChatMessages,
  type InsertChatMessages,
} from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // User preferences
  getUserPreferences(userId: string): Promise<UserPreferences | undefined>;
  updateUserPreferences(preferences: InsertUserPreferences): Promise<UserPreferences>;

  // User progress
  getUserProgress(userId: string, subject?: string, grade?: string): Promise<UserProgress[]>;
  updateUserProgress(progress: InsertUserProgress): Promise<UserProgress>;

  // User achievements
  getUserAchievements(userId: string): Promise<UserAchievements[]>;
  awardAchievement(achievement: InsertUserAchievements): Promise<UserAchievements>;

  // Shared content
  getSharedContent(limit?: number): Promise<SharedContent[]>;
  shareContent(content: InsertSharedContent): Promise<SharedContent>;

  // Tutor scripts
  getTutorScripts(filters?: { tone?: string; grade?: string; subject?: string }): Promise<TutorScripts[]>;
  saveTutorScript(script: InsertTutorScripts): Promise<TutorScripts>;

  // Coding problems
  getCodingProblems(language?: string, difficulty?: string): Promise<CodingProblems[]>;
  saveCodingProblem(problem: InsertCodingProblems): Promise<CodingProblems>;

  // AR problems
  getARProblems(subject?: string, grade?: string): Promise<ARProblems[]>;
  saveARProblem(problem: InsertARProblems): Promise<ARProblems>;

  // Stories
  getStories(language?: string, gradeLevel?: string): Promise<Stories[]>;
  saveStory(story: InsertStories): Promise<Stories>;

  // Voice quizzes
  getVoiceQuizzes(language?: string, difficulty?: string, subject?: string): Promise<VoiceQuizzes[]>;
  saveVoiceQuiz(quiz: InsertVoiceQuizzes): Promise<VoiceQuizzes>;

  // Collaborative sessions
  getCollaborativeSession(sessionId: string): Promise<CollaborativeSessions | undefined>;
  createCollaborativeSession(session: InsertCollaborativeSessions): Promise<CollaborativeSessions>;
  updateCollaborativeSession(sessionId: string, updates: Partial<InsertCollaborativeSessions>): Promise<CollaborativeSessions>;
  getSessionParticipants(sessionId: string): Promise<SessionParticipants[]>;
  addSessionParticipant(participant: InsertSessionParticipants): Promise<SessionParticipants>;
  getChatMessages(sessionId: string): Promise<ChatMessages[]>;
  saveChatMessage(message: InsertChatMessages): Promise<ChatMessages>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id));
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.username, username));
    return result[0];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const result = await db.insert(users).values(insertUser).returning();
    return result[0];
  }

  // User preferences
  async getUserPreferences(userId: string): Promise<UserPreferences | undefined> {
    const result = await db.select().from(userPreferences).where(eq(userPreferences.user_id, userId));
    return result[0];
  }

  async updateUserPreferences(preferences: InsertUserPreferences): Promise<UserPreferences> {
    const existing = await this.getUserPreferences(preferences.user_id);
    
    if (existing) {
      const result = await db
        .update(userPreferences)
        .set({ ...preferences, updated_at: new Date() })
        .where(eq(userPreferences.user_id, preferences.user_id))
        .returning();
      return result[0];
    } else {
      const result = await db.insert(userPreferences).values(preferences).returning();
      return result[0];
    }
  }

  // User progress
  async getUserProgress(userId: string, subject?: string, grade?: string): Promise<UserProgress[]> {
    const conditions = [eq(userProgress.user_id, userId)];
    
    if (subject) conditions.push(eq(userProgress.subject, subject));
    if (grade) conditions.push(eq(userProgress.grade, grade));
    
    return await db
      .select()
      .from(userProgress)
      .where(and(...conditions))
      .orderBy(desc(userProgress.last_activity));
  }

  async updateUserProgress(progress: InsertUserProgress): Promise<UserProgress> {
    const existing = await db
      .select()
      .from(userProgress)
      .where(
        and(
          eq(userProgress.user_id, progress.user_id),
          eq(userProgress.subject, progress.subject),
          eq(userProgress.grade, progress.grade)
        )
      );

    if (existing.length > 0) {
      const result = await db
        .update(userProgress)
        .set({ ...progress, updated_at: new Date() })
        .where(
          and(
            eq(userProgress.user_id, progress.user_id),
            eq(userProgress.subject, progress.subject),
            eq(userProgress.grade, progress.grade)
          )
        )
        .returning();
      return result[0];
    } else {
      const result = await db.insert(userProgress).values(progress).returning();
      return result[0];
    }
  }

  // User achievements
  async getUserAchievements(userId: string): Promise<UserAchievements[]> {
    return await db
      .select()
      .from(userAchievements)
      .where(eq(userAchievements.user_id, userId))
      .orderBy(desc(userAchievements.earned_date));
  }

  async awardAchievement(achievement: InsertUserAchievements): Promise<UserAchievements> {
    const result = await db.insert(userAchievements).values(achievement).returning();
    return result[0];
  }

  // Shared content
  async getSharedContent(limit: number = 20): Promise<SharedContent[]> {
    return await db
      .select()
      .from(sharedContent)
      .orderBy(desc(sharedContent.created_at))
      .limit(limit);
  }

  async shareContent(content: InsertSharedContent): Promise<SharedContent> {
    const result = await db.insert(sharedContent).values(content).returning();
    return result[0];
  }

  // Tutor scripts
  async getTutorScripts(filters: { tone?: string; grade?: string; subject?: string } = {}): Promise<TutorScripts[]> {
    const conditions = [];

    if (filters.tone) conditions.push(eq(tutorScripts.tone, filters.tone));
    if (filters.grade) conditions.push(eq(tutorScripts.grade, filters.grade));
    if (filters.subject) conditions.push(eq(tutorScripts.subject, filters.subject));

    let query = db.select().from(tutorScripts);
    
    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    return await query.orderBy(desc(tutorScripts.created_at)).limit(10);
  }

  async saveTutorScript(script: InsertTutorScripts): Promise<TutorScripts> {
    const result = await db.insert(tutorScripts).values(script).returning();
    return result[0];
  }

  // Coding problems
  async getCodingProblems(language?: string, difficulty?: string): Promise<CodingProblems[]> {
    const conditions = [];

    if (language) conditions.push(eq(codingProblems.language, language));
    if (difficulty) conditions.push(eq(codingProblems.difficulty, difficulty));

    let query = db.select().from(codingProblems);
    
    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    return await query.orderBy(desc(codingProblems.created_at));
  }

  async saveCodingProblem(problem: InsertCodingProblems): Promise<CodingProblems> {
    const result = await db.insert(codingProblems).values(problem).returning();
    return result[0];
  }

  // AR problems
  async getARProblems(subject?: string, grade?: string): Promise<ARProblems[]> {
    const conditions = [];

    if (subject) conditions.push(eq(arProblems.subject, subject));
    if (grade) conditions.push(eq(arProblems.grade, grade));

    let query = db.select().from(arProblems);
    
    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    return await query.orderBy(desc(arProblems.created_at));
  }

  async saveARProblem(problem: InsertARProblems): Promise<ARProblems> {
    const result = await db.insert(arProblems).values(problem).returning();
    return result[0];
  }

  // Stories
  async getStories(language?: string, gradeLevel?: string): Promise<Stories[]> {
    const conditions = [];

    if (language) conditions.push(eq(stories.language, language));
    if (gradeLevel) conditions.push(eq(stories.grade_level, gradeLevel));

    let query = db.select().from(stories);
    
    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    return await query.orderBy(desc(stories.created_at));
  }

  async saveStory(story: InsertStories): Promise<Stories> {
    const result = await db.insert(stories).values(story).returning();
    return result[0];
  }

  // Voice quizzes
  async getVoiceQuizzes(language?: string, difficulty?: string, subject?: string): Promise<VoiceQuizzes[]> {
    const conditions = [];

    if (language) conditions.push(eq(voiceQuizzes.language, language));
    if (difficulty) conditions.push(eq(voiceQuizzes.difficulty, difficulty));
    if (subject) conditions.push(eq(voiceQuizzes.subject, subject));

    let query = db.select().from(voiceQuizzes);
    
    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    return await query.orderBy(desc(voiceQuizzes.created_at));
  }

  async saveVoiceQuiz(quiz: InsertVoiceQuizzes): Promise<VoiceQuizzes> {
    const result = await db.insert(voiceQuizzes).values(quiz).returning();
    return result[0];
  }

  // Collaborative sessions
  async getCollaborativeSession(sessionId: string): Promise<CollaborativeSessions | undefined> {
    const result = await db
      .select()
      .from(collaborativeSessions)
      .where(eq(collaborativeSessions.session_id, sessionId));
    return result[0];
  }

  async createCollaborativeSession(session: InsertCollaborativeSessions): Promise<CollaborativeSessions> {
    const result = await db.insert(collaborativeSessions).values(session).returning();
    return result[0];
  }

  async updateCollaborativeSession(sessionId: string, updates: Partial<InsertCollaborativeSessions>): Promise<CollaborativeSessions> {
    const result = await db
      .update(collaborativeSessions)
      .set({ ...updates, updated_at: new Date() })
      .where(eq(collaborativeSessions.session_id, sessionId))
      .returning();
    return result[0];
  }

  async getSessionParticipants(sessionId: string): Promise<SessionParticipants[]> {
    return await db
      .select()
      .from(sessionParticipants)
      .where(eq(sessionParticipants.session_id, sessionId))
      .orderBy(desc(sessionParticipants.joined_at));
  }

  async addSessionParticipant(participant: InsertSessionParticipants): Promise<SessionParticipants> {
    const result = await db.insert(sessionParticipants).values(participant).returning();
    return result[0];
  }

  async getChatMessages(sessionId: string): Promise<ChatMessages[]> {
    return await db
      .select()
      .from(chatMessages)
      .where(eq(chatMessages.session_id, sessionId))
      .orderBy(desc(chatMessages.timestamp));
  }

  async saveChatMessage(message: InsertChatMessages): Promise<ChatMessages> {
    const result = await db.insert(chatMessages).values(message).returning();
    return result[0];
  }
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private preferences: Map<string, UserPreferences>;
  private progress: Map<string, UserProgress[]>;
  private achievements: Map<string, UserAchievements[]>;
  private content: SharedContent[];
  private scripts: TutorScripts[];
  private codingProbs: CodingProblems[];
  private arProbs: ARProblems[];
  private storyData: Stories[];
  private quizzes: VoiceQuizzes[];
  private sessions: Map<string, CollaborativeSessions>;
  private participants: Map<string, SessionParticipants[]>;
  private messages: Map<string, ChatMessages[]>;
  currentId: number;

  constructor() {
    this.users = new Map();
    this.preferences = new Map();
    this.progress = new Map();
    this.achievements = new Map();
    this.content = [];
    this.scripts = [];
    this.codingProbs = [];
    this.arProbs = [];
    this.storyData = [];
    this.quizzes = [];
    this.sessions = new Map();
    this.participants = new Map();
    this.messages = new Map();
    this.currentId = 1;
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const user: User = { ...insertUser, id, created_at: new Date() };
    this.users.set(id, user);
    return user;
  }

  // User preferences
  async getUserPreferences(userId: string): Promise<UserPreferences | undefined> {
    return this.preferences.get(userId);
  }

  async updateUserPreferences(preferences: InsertUserPreferences): Promise<UserPreferences> {
    const pref: UserPreferences = {
      ...preferences,
      id: this.currentId++,
      updated_at: new Date(),
    };
    this.preferences.set(preferences.user_id, pref);
    return pref;
  }

  // User progress
  async getUserProgress(userId: string, subject?: string, grade?: string): Promise<UserProgress[]> {
    const userProgress = this.progress.get(userId) || [];
    return userProgress.filter(p => {
      if (subject && p.subject !== subject) return false;
      if (grade && p.grade !== grade) return false;
      return true;
    });
  }

  async updateUserProgress(progress: InsertUserProgress): Promise<UserProgress> {
    const userProgress = this.progress.get(progress.user_id) || [];
    const existingIndex = userProgress.findIndex(p => 
      p.subject === progress.subject && p.grade === progress.grade
    );
    
    const prog: UserProgress = {
      ...progress,
      id: this.currentId++,
      created_at: new Date(),
      updated_at: new Date(),
      last_activity: new Date(),
    };

    if (existingIndex >= 0) {
      userProgress[existingIndex] = prog;
    } else {
      userProgress.push(prog);
    }
    
    this.progress.set(progress.user_id, userProgress);
    return prog;
  }

  // User achievements
  async getUserAchievements(userId: string): Promise<UserAchievements[]> {
    return this.achievements.get(userId) || [];
  }

  async awardAchievement(achievement: InsertUserAchievements): Promise<UserAchievements> {
    const userAchievements = this.achievements.get(achievement.user_id) || [];
    const ach: UserAchievements = {
      ...achievement,
      id: this.currentId++,
      earned_date: new Date(),
    };
    userAchievements.push(ach);
    this.achievements.set(achievement.user_id, userAchievements);
    return ach;
  }

  // Shared content
  async getSharedContent(limit: number = 20): Promise<SharedContent[]> {
    return this.content.slice(0, limit);
  }

  async shareContent(content: InsertSharedContent): Promise<SharedContent> {
    const shared: SharedContent = {
      ...content,
      id: this.currentId++,
      created_at: new Date(),
    };
    this.content.unshift(shared);
    return shared;
  }

  // Tutor scripts
  async getTutorScripts(filters: { tone?: string; grade?: string; subject?: string } = {}): Promise<TutorScripts[]> {
    return this.scripts.filter(script => {
      if (filters.tone && script.tone !== filters.tone) return false;
      if (filters.grade && script.grade !== filters.grade) return false;
      if (filters.subject && script.subject !== filters.subject) return false;
      return true;
    }).slice(0, 10);
  }

  async saveTutorScript(script: InsertTutorScripts): Promise<TutorScripts> {
    const saved: TutorScripts = {
      ...script,
      id: this.currentId++,
      created_at: new Date(),
    };
    this.scripts.unshift(saved);
    return saved;
  }

  // Coding problems
  async getCodingProblems(language?: string, difficulty?: string): Promise<CodingProblems[]> {
    return this.codingProbs.filter(prob => {
      if (language && prob.language !== language) return false;
      if (difficulty && prob.difficulty !== difficulty) return false;
      return true;
    });
  }

  async saveCodingProblem(problem: InsertCodingProblems): Promise<CodingProblems> {
    const saved: CodingProblems = {
      ...problem,
      id: this.currentId++,
      created_at: new Date(),
    };
    this.codingProbs.unshift(saved);
    return saved;
  }

  // AR problems
  async getARProblems(subject?: string, grade?: string): Promise<ARProblems[]> {
    return this.arProbs.filter(prob => {
      if (subject && prob.subject !== subject) return false;
      if (grade && prob.grade !== grade) return false;
      return true;
    });
  }

  async saveARProblem(problem: InsertARProblems): Promise<ARProblems> {
    const saved: ARProblems = {
      ...problem,
      id: this.currentId++,
      created_at: new Date(),
    };
    this.arProbs.unshift(saved);
    return saved;
  }

  // Stories
  async getStories(language?: string, gradeLevel?: string): Promise<Stories[]> {
    return this.storyData.filter(story => {
      if (language && story.language !== language) return false;
      if (gradeLevel && story.grade_level !== gradeLevel) return false;
      return true;
    });
  }

  async saveStory(story: InsertStories): Promise<Stories> {
    const saved: Stories = {
      ...story,
      id: this.currentId++,
      created_at: new Date(),
    };
    this.storyData.unshift(saved);
    return saved;
  }

  // Voice quizzes
  async getVoiceQuizzes(language?: string, difficulty?: string, subject?: string): Promise<VoiceQuizzes[]> {
    return this.quizzes.filter(quiz => {
      if (language && quiz.language !== language) return false;
      if (difficulty && quiz.difficulty !== difficulty) return false;
      if (subject && quiz.subject !== subject) return false;
      return true;
    });
  }

  async saveVoiceQuiz(quiz: InsertVoiceQuizzes): Promise<VoiceQuizzes> {
    const saved: VoiceQuizzes = {
      ...quiz,
      id: this.currentId++,
      created_at: new Date(),
    };
    this.quizzes.unshift(saved);
    return saved;
  }

  // Collaborative sessions
  async getCollaborativeSession(sessionId: string): Promise<CollaborativeSessions | undefined> {
    return this.sessions.get(sessionId);
  }

  async createCollaborativeSession(session: InsertCollaborativeSessions): Promise<CollaborativeSessions> {
    const saved: CollaborativeSessions = {
      ...session,
      id: this.currentId++,
      created_at: new Date(),
      updated_at: new Date(),
    };
    this.sessions.set(session.session_id, saved);
    return saved;
  }

  async updateCollaborativeSession(sessionId: string, updates: Partial<InsertCollaborativeSessions>): Promise<CollaborativeSessions> {
    const existing = this.sessions.get(sessionId);
    if (!existing) throw new Error('Session not found');
    
    const updated: CollaborativeSessions = {
      ...existing,
      ...updates,
      updated_at: new Date(),
    };
    this.sessions.set(sessionId, updated);
    return updated;
  }

  async getSessionParticipants(sessionId: string): Promise<SessionParticipants[]> {
    return this.participants.get(sessionId) || [];
  }

  async addSessionParticipant(participant: InsertSessionParticipants): Promise<SessionParticipants> {
    const saved: SessionParticipants = {
      ...participant,
      id: this.currentId++,
      joined_at: new Date(),
    };
    const sessionParticipants = this.participants.get(participant.session_id) || [];
    sessionParticipants.push(saved);
    this.participants.set(participant.session_id, sessionParticipants);
    return saved;
  }

  async getChatMessages(sessionId: string): Promise<ChatMessages[]> {
    return this.messages.get(sessionId) || [];
  }

  async saveChatMessage(message: InsertChatMessages): Promise<ChatMessages> {
    const saved: ChatMessages = {
      ...message,
      id: this.currentId++,
      timestamp: new Date(),
    };
    const sessionMessages = this.messages.get(message.session_id) || [];
    sessionMessages.push(saved);
    this.messages.set(message.session_id, sessionMessages);
    return saved;
  }
}

// Use DatabaseStorage for production
export const storage = new DatabaseStorage();
