import { pgTable, text, serial, integer, boolean, timestamp, json, numeric } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  created_at: timestamp("created_at").defaultNow(),
});

export const userPreferences = pgTable("user_preferences", {
  id: serial("id").primaryKey(),
  user_id: text("user_id").notNull(),
  preferred_subject: text("preferred_subject").default('math'),
  preferred_difficulty: integer("preferred_difficulty").default(2),
  preferred_language: text("preferred_language").default('en'),
  learning_style: text("learning_style").default('visual'),
  daily_goal_minutes: integer("daily_goal_minutes").default(30),
  updated_at: timestamp("updated_at").defaultNow(),
});

export const userProgress = pgTable("user_progress", {
  id: serial("id").primaryKey(),
  user_id: text("user_id").notNull(),
  subject: text("subject").notNull(),
  grade: text("grade").notNull(),
  total_attempted: integer("total_attempted").default(0),
  total_correct: integer("total_correct").default(0),
  streak_days: integer("streak_days").default(0),
  last_activity: timestamp("last_activity").defaultNow(),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

export const userAchievements = pgTable("user_achievements", {
  id: serial("id").primaryKey(),
  user_id: text("user_id").notNull(),
  badge_name: text("badge_name").notNull(),
  badge_description: text("badge_description"),
  badge_icon: text("badge_icon"),
  earned_date: timestamp("earned_date").defaultNow(),
  points: integer("points").default(0),
  category: text("category"),
});

export const sharedContent = pgTable("shared_content", {
  id: serial("id").primaryKey(),
  user_id: text("user_id").notNull(),
  content_type: text("content_type").notNull(),
  content_title: text("content_title").notNull(),
  share_url: text("share_url").notNull(),
  thumbnail_url: text("thumbnail_url"),
  description: text("description"),
  views: integer("views").default(0),
  likes: integer("likes").default(0),
  created_at: timestamp("created_at").defaultNow(),
});

export const tutorScripts = pgTable("tutor_scripts", {
  id: serial("id").primaryKey(),
  tone: text("tone").notNull(),
  script: text("script").notNull(),
  grade: text("grade").notNull(),
  subject: text("subject").notNull(),
  topic: text("topic").notNull(),
  duration_minutes: integer("duration_minutes"),
  voice_settings: json("voice_settings"),
  created_at: timestamp("created_at").defaultNow(),
});

export const codingProblems = pgTable("coding_problems", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  difficulty: text("difficulty").notNull(),
  language: text("language").notNull(),
  starter_code: text("starter_code"),
  solution: text("solution"),
  test_cases: json("test_cases"),
  created_at: timestamp("created_at").defaultNow(),
});

export const arProblems = pgTable("ar_problems", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  subject: text("subject").notNull(),
  grade: text("grade").notNull(),
  difficulty: integer("difficulty").default(1),
  ar_data: json("ar_data"),
  answer: text("answer"),
  hints: json("hints"),
  created_at: timestamp("created_at").defaultNow(),
});

export const stories = pgTable("stories", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  language: text("language").default('en'),
  grade_level: text("grade_level"),
  subject: text("subject"),
  audio_url: text("audio_url"),
  images: json("images"),
  is_premium: boolean("is_premium").default(false),
  created_at: timestamp("created_at").defaultNow(),
});

export const voiceQuizzes = pgTable("voice_quizzes", {
  id: serial("id").primaryKey(),
  question: text("question").notNull(),
  answer: text("answer").notNull(),
  alternative_answers: json("alternative_answers"),
  hint: text("hint"),
  language: text("language").default('en'),
  difficulty: text("difficulty").default('medium'),
  grade_level: text("grade_level"),
  subject: text("subject"),
  created_at: timestamp("created_at").defaultNow(),
});

export const collaborativeSessions = pgTable("collaborative_sessions", {
  id: serial("id").primaryKey(),
  session_id: text("session_id").notNull().unique(),
  creator_id: text("creator_id").notNull(),
  title: text("title"),
  language: text("language").default('javascript'),
  code: text("code"),
  is_active: boolean("is_active").default(true),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

export const sessionParticipants = pgTable("session_participants", {
  id: serial("id").primaryKey(),
  session_id: text("session_id").notNull(),
  user_id: text("user_id").notNull(),
  joined_at: timestamp("joined_at").defaultNow(),
});

export const chatMessages = pgTable("chat_messages", {
  id: serial("id").primaryKey(),
  session_id: text("session_id").notNull(),
  user_id: text("user_id").notNull(),
  username: text("username").notNull(),
  message: text("message").notNull(),
  timestamp: timestamp("timestamp").defaultNow(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertUserPreferencesSchema = createInsertSchema(userPreferences).omit({
  id: true,
  updated_at: true,
});

export const insertUserProgressSchema = createInsertSchema(userProgress).omit({
  id: true,
  created_at: true,
  updated_at: true,
});

export const insertUserAchievementSchema = createInsertSchema(userAchievements).omit({
  id: true,
  earned_date: true,
});

export const insertSharedContentSchema = createInsertSchema(sharedContent).omit({
  id: true,
  created_at: true,
});

export const insertTutorScriptSchema = createInsertSchema(tutorScripts).omit({
  id: true,
  created_at: true,
});

export const insertCodingProblemSchema = createInsertSchema(codingProblems).omit({
  id: true,
  created_at: true,
});

export const insertARProblemSchema = createInsertSchema(arProblems).omit({
  id: true,
  created_at: true,
});

export const insertStorySchema = createInsertSchema(stories).omit({
  id: true,
  created_at: true,
});

export const insertVoiceQuizSchema = createInsertSchema(voiceQuizzes).omit({
  id: true,
  created_at: true,
});

export const insertCollaborativeSessionSchema = createInsertSchema(collaborativeSessions).omit({
  id: true,
  created_at: true,
  updated_at: true,
});

export const insertSessionParticipantSchema = createInsertSchema(sessionParticipants).omit({
  id: true,
  joined_at: true,
});

export const insertChatMessageSchema = createInsertSchema(chatMessages).omit({
  id: true,
  timestamp: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type UserPreferences = typeof userPreferences.$inferSelect;
export type InsertUserPreferences = z.infer<typeof insertUserPreferencesSchema>;
export type UserProgress = typeof userProgress.$inferSelect;
export type InsertUserProgress = z.infer<typeof insertUserProgressSchema>;
export type UserAchievements = typeof userAchievements.$inferSelect;
export type InsertUserAchievements = z.infer<typeof insertUserAchievementSchema>;
export type SharedContent = typeof sharedContent.$inferSelect;
export type InsertSharedContent = z.infer<typeof insertSharedContentSchema>;
export type TutorScripts = typeof tutorScripts.$inferSelect;
export type InsertTutorScripts = z.infer<typeof insertTutorScriptSchema>;
export type CodingProblems = typeof codingProblems.$inferSelect;
export type InsertCodingProblems = z.infer<typeof insertCodingProblemSchema>;
export type ARProblems = typeof arProblems.$inferSelect;
export type InsertARProblems = z.infer<typeof insertARProblemSchema>;
export type Stories = typeof stories.$inferSelect;
export type InsertStories = z.infer<typeof insertStorySchema>;
export type VoiceQuizzes = typeof voiceQuizzes.$inferSelect;
export type InsertVoiceQuizzes = z.infer<typeof insertVoiceQuizSchema>;
export type CollaborativeSessions = typeof collaborativeSessions.$inferSelect;
export type InsertCollaborativeSessions = z.infer<typeof insertCollaborativeSessionSchema>;
export type SessionParticipants = typeof sessionParticipants.$inferSelect;
export type InsertSessionParticipants = z.infer<typeof insertSessionParticipantSchema>;
export type ChatMessages = typeof chatMessages.$inferSelect;
export type InsertChatMessages = z.infer<typeof insertChatMessageSchema>;
