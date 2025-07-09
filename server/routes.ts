import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import {
  insertUserPreferencesSchema,
  insertUserProgressSchema,
  insertUserAchievementSchema,
  insertSharedContentSchema,
  insertTutorScriptSchema,
  insertCodingProblemSchema,
  insertARProblemSchema,
  insertStorySchema,
  insertVoiceQuizSchema,
  insertCollaborativeSessionSchema,
  insertSessionParticipantSchema,
  insertChatMessageSchema,
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // User Preferences Routes
  app.get("/api/user-preferences/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const preferences = await storage.getUserPreferences(userId);
      
      // Return default preferences if none found
      if (!preferences) {
        return res.json({
          user_id: userId,
          preferred_subject: 'math',
          preferred_difficulty: 2,
          preferred_language: 'en',
          learning_style: 'visual',
          daily_goal_minutes: 30
        });
      }
      
      res.json(preferences);
    } catch (error) {
      console.error('Error fetching user preferences:', error);
      res.status(500).json({ error: 'Failed to fetch user preferences' });
    }
  });

  app.post("/api/user-preferences", async (req, res) => {
    try {
      const validatedData = insertUserPreferencesSchema.parse(req.body);
      const preferences = await storage.updateUserPreferences(validatedData);
      res.json(preferences);
    } catch (error) {
      console.error('Error updating user preferences:', error);
      res.status(500).json({ error: 'Failed to update user preferences' });
    }
  });

  // User Progress Routes
  app.get("/api/user-progress/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const { subject, grade } = req.query;
      const progress = await storage.getUserProgress(
        userId, 
        subject as string, 
        grade as string
      );
      res.json(progress);
    } catch (error) {
      console.error('Error fetching user progress:', error);
      res.status(500).json({ error: 'Failed to fetch user progress' });
    }
  });

  app.post("/api/user-progress", async (req, res) => {
    try {
      const validatedData = insertUserProgressSchema.parse(req.body);
      const progress = await storage.updateUserProgress(validatedData);
      res.json(progress);
    } catch (error) {
      console.error('Error updating user progress:', error);
      res.status(500).json({ error: 'Failed to update user progress' });
    }
  });

  // User Achievements Routes
  app.get("/api/user-achievements/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const achievements = await storage.getUserAchievements(userId);
      res.json(achievements);
    } catch (error) {
      console.error('Error fetching user achievements:', error);
      res.status(500).json({ error: 'Failed to fetch user achievements' });
    }
  });

  app.post("/api/user-achievements", async (req, res) => {
    try {
      const validatedData = insertUserAchievementSchema.parse(req.body);
      const achievement = await storage.awardAchievement(validatedData);
      res.json(achievement);
    } catch (error) {
      console.error('Error awarding achievement:', error);
      res.status(500).json({ error: 'Failed to award achievement' });
    }
  });

  // Shared Content Routes
  app.get("/api/shared-content", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 20;
      const content = await storage.getSharedContent(limit);
      res.json(content);
    } catch (error) {
      console.error('Error fetching shared content:', error);
      res.status(500).json({ error: 'Failed to fetch shared content' });
    }
  });

  app.post("/api/shared-content", async (req, res) => {
    try {
      const validatedData = insertSharedContentSchema.parse(req.body);
      const content = await storage.shareContent(validatedData);
      res.json(content);
    } catch (error) {
      console.error('Error sharing content:', error);
      res.status(500).json({ error: 'Failed to share content' });
    }
  });

  // Tutor Scripts Routes
  app.get("/api/tutor-scripts", async (req, res) => {
    try {
      const { tone, grade, subject } = req.query;
      const scripts = await storage.getTutorScripts({
        tone: tone as string,
        grade: grade as string,
        subject: subject as string
      });
      res.json(scripts);
    } catch (error) {
      console.error('Error fetching tutor scripts:', error);
      res.status(500).json({ error: 'Failed to fetch tutor scripts' });
    }
  });

  app.post("/api/tutor-scripts", async (req, res) => {
    try {
      const validatedData = insertTutorScriptSchema.parse(req.body);
      const script = await storage.saveTutorScript(validatedData);
      res.json(script);
    } catch (error) {
      console.error('Error saving tutor script:', error);
      res.status(500).json({ error: 'Failed to save tutor script' });
    }
  });

  // Coding Problems Routes
  app.get("/api/coding-problems", async (req, res) => {
    try {
      const { language, difficulty } = req.query;
      const problems = await storage.getCodingProblems(
        language as string,
        difficulty as string
      );
      res.json(problems);
    } catch (error) {
      console.error('Error fetching coding problems:', error);
      res.status(500).json({ error: 'Failed to fetch coding problems' });
    }
  });

  app.post("/api/coding-problems", async (req, res) => {
    try {
      const validatedData = insertCodingProblemSchema.parse(req.body);
      const problem = await storage.saveCodingProblem(validatedData);
      res.json(problem);
    } catch (error) {
      console.error('Error saving coding problem:', error);
      res.status(500).json({ error: 'Failed to save coding problem' });
    }
  });

  // AR Problems Routes
  app.get("/api/ar-problems", async (req, res) => {
    try {
      const { subject, grade } = req.query;
      const problems = await storage.getARProblems(
        subject as string,
        grade as string
      );
      res.json(problems);
    } catch (error) {
      console.error('Error fetching AR problems:', error);
      res.status(500).json({ error: 'Failed to fetch AR problems' });
    }
  });

  app.post("/api/ar-problems", async (req, res) => {
    try {
      const validatedData = insertARProblemSchema.parse(req.body);
      const problem = await storage.saveARProblem(validatedData);
      res.json(problem);
    } catch (error) {
      console.error('Error saving AR problem:', error);
      res.status(500).json({ error: 'Failed to save AR problem' });
    }
  });

  // Stories Routes
  app.get("/api/stories", async (req, res) => {
    try {
      const { language, gradeLevel } = req.query;
      const stories = await storage.getStories(
        language as string,
        gradeLevel as string
      );
      res.json(stories);
    } catch (error) {
      console.error('Error fetching stories:', error);
      res.status(500).json({ error: 'Failed to fetch stories' });
    }
  });

  app.post("/api/stories", async (req, res) => {
    try {
      const validatedData = insertStorySchema.parse(req.body);
      const story = await storage.saveStory(validatedData);
      res.json(story);
    } catch (error) {
      console.error('Error saving story:', error);
      res.status(500).json({ error: 'Failed to save story' });
    }
  });

  // Voice Quizzes Routes
  app.get("/api/voice-quizzes", async (req, res) => {
    try {
      const { language, difficulty, subject } = req.query;
      const quizzes = await storage.getVoiceQuizzes(
        language as string,
        difficulty as string,
        subject as string
      );
      res.json(quizzes);
    } catch (error) {
      console.error('Error fetching voice quizzes:', error);
      res.status(500).json({ error: 'Failed to fetch voice quizzes' });
    }
  });

  app.post("/api/voice-quizzes", async (req, res) => {
    try {
      const validatedData = insertVoiceQuizSchema.parse(req.body);
      const quiz = await storage.saveVoiceQuiz(validatedData);
      res.json(quiz);
    } catch (error) {
      console.error('Error saving voice quiz:', error);
      res.status(500).json({ error: 'Failed to save voice quiz' });
    }
  });

  // Collaborative Sessions Routes
  app.get("/api/collaborative-sessions/:sessionId", async (req, res) => {
    try {
      const { sessionId } = req.params;
      const session = await storage.getCollaborativeSession(sessionId);
      if (!session) {
        return res.status(404).json({ error: 'Session not found' });
      }
      res.json(session);
    } catch (error) {
      console.error('Error fetching collaborative session:', error);
      res.status(500).json({ error: 'Failed to fetch collaborative session' });
    }
  });

  app.post("/api/collaborative-sessions", async (req, res) => {
    try {
      const validatedData = insertCollaborativeSessionSchema.parse(req.body);
      const session = await storage.createCollaborativeSession(validatedData);
      res.json(session);
    } catch (error) {
      console.error('Error creating collaborative session:', error);
      res.status(500).json({ error: 'Failed to create collaborative session' });
    }
  });

  app.patch("/api/collaborative-sessions/:sessionId", async (req, res) => {
    try {
      const { sessionId } = req.params;
      const session = await storage.updateCollaborativeSession(sessionId, req.body);
      res.json(session);
    } catch (error) {
      console.error('Error updating collaborative session:', error);
      res.status(500).json({ error: 'Failed to update collaborative session' });
    }
  });

  // Session Participants Routes
  app.get("/api/collaborative-sessions/:sessionId/participants", async (req, res) => {
    try {
      const { sessionId } = req.params;
      const participants = await storage.getSessionParticipants(sessionId);
      res.json(participants);
    } catch (error) {
      console.error('Error fetching session participants:', error);
      res.status(500).json({ error: 'Failed to fetch session participants' });
    }
  });

  app.post("/api/collaborative-sessions/:sessionId/participants", async (req, res) => {
    try {
      const { sessionId } = req.params;
      const validatedData = insertSessionParticipantSchema.parse({
        ...req.body,
        session_id: sessionId
      });
      const participant = await storage.addSessionParticipant(validatedData);
      res.json(participant);
    } catch (error) {
      console.error('Error adding session participant:', error);
      res.status(500).json({ error: 'Failed to add session participant' });
    }
  });

  // Chat Messages Routes
  app.get("/api/collaborative-sessions/:sessionId/messages", async (req, res) => {
    try {
      const { sessionId } = req.params;
      const messages = await storage.getChatMessages(sessionId);
      res.json(messages);
    } catch (error) {
      console.error('Error fetching chat messages:', error);
      res.status(500).json({ error: 'Failed to fetch chat messages' });
    }
  });

  app.post("/api/collaborative-sessions/:sessionId/messages", async (req, res) => {
    try {
      const { sessionId } = req.params;
      const validatedData = insertChatMessageSchema.parse({
        ...req.body,
        session_id: sessionId
      });
      const message = await storage.saveChatMessage(validatedData);
      res.json(message);
    } catch (error) {
      console.error('Error saving chat message:', error);
      res.status(500).json({ error: 'Failed to save chat message' });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
