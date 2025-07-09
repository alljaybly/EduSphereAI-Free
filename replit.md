# EduSphere AI - Educational Platform

## Overview

EduSphere AI is a comprehensive educational platform built as a full-stack web application for the World's Largest Hackathon. The platform provides interactive learning experiences across multiple subjects and grade levels, featuring AI-generated content, augmented reality learning, collaborative coding, voice recognition, and story-based education.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

The application follows a modern full-stack architecture with clear separation between client and server components:

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: React Router for navigation
- **State Management**: Zustand for global state
- **Styling**: Tailwind CSS with custom design system
- **UI Components**: Radix UI primitives with shadcn/ui
- **Animations**: Framer Motion for smooth transitions
- **Build Tool**: Vite for fast development and optimized builds

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ES modules
- **Database ORM**: Drizzle ORM
- **Database**: PostgreSQL (configured for Neon serverless)
- **Real-time**: Supabase for real-time features
- **Session Storage**: PostgreSQL-based sessions

## Key Components

### Data Layer
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Schema**: Shared schema definitions in `/shared/schema.ts`
- **Migrations**: Automated database migrations in `/migrations`
- **Storage Interface**: Abstracted storage layer supporting both memory and database storage

### Authentication & User Management
- **Authentication**: Supabase Auth integration
- **User Identification**: Fallback system using localStorage for anonymous users
- **Session Management**: PostgreSQL-based session storage with connect-pg-simple

### Educational Features
- **Subject Coverage**: Math, Physics, Science, English, History, Geography, Coding
- **Grade Levels**: Kindergarten through Matric (Grade 12)
- **Problem Generation**: AI-powered problem generation with difficulty scaling
- **Progress Tracking**: Comprehensive analytics and performance tracking

### Advanced Features
- **AR Learning**: WebXR-based augmented reality experiences
- **Voice Recognition**: Enhanced speech-to-text with multiple language support
- **Story Mode**: Interactive storytelling with AI narratives
- **Collaborative Coding**: Real-time code sharing and collaboration
- **Live Coding**: Interactive coding environment with instant feedback

## Data Flow

1. **User Authentication**: Users can authenticate via Supabase or continue anonymously
2. **Subject/Grade Selection**: Users select their learning preferences through the book interface
3. **Problem Generation**: AI generates appropriate content based on user selections
4. **Interactive Learning**: Users engage with problems, receive feedback, and track progress
5. **Progress Persistence**: All user progress is stored in PostgreSQL via Drizzle ORM
6. **Real-time Features**: Collaborative features use Supabase real-time subscriptions

## External Dependencies

### Core Infrastructure
- **Neon Database**: Serverless PostgreSQL hosting
- **Supabase**: Authentication, real-time subscriptions, and additional storage
- **Sentry**: Error monitoring and performance tracking

### UI/UX Libraries
- **Radix UI**: Accessible component primitives
- **Framer Motion**: Advanced animations and transitions
- **Lucide React**: Consistent icon system
- **Canvas Confetti**: Celebration animations

### Development Tools
- **Drizzle Kit**: Database schema management and migrations
- **ESBuild**: Fast bundling for production builds
- **TSX**: TypeScript execution for development

### Educational Integrations
- **Web Speech API**: Browser-native voice recognition
- **WebXR**: Augmented reality capabilities
- **Canvas API**: Interactive visualizations and AR overlays

## Deployment Strategy

### Development Environment
- **Dev Server**: Vite development server with HMR
- **Backend**: tsx for TypeScript execution with auto-reload
- **Database**: Local development with Neon database connection

### Production Build
- **Frontend**: Vite builds optimized static assets to `/dist/public`
- **Backend**: ESBuild bundles server code to `/dist/index.js`
- **Database**: Drizzle migrations applied via `db:push` command

### Environment Configuration
- **Database**: `DATABASE_URL` environment variable for PostgreSQL connection
- **Supabase**: Client configuration via environment variables
- **Replit Integration**: Custom Vite plugins for Replit environment support

### Key Architectural Decisions

1. **Monorepo Structure**: Single repository with client, server, and shared code for easier development and deployment
2. **TypeScript Throughout**: End-to-end type safety from database to frontend
3. **Drizzle ORM**: Chosen for type-safe database operations and easy PostgreSQL integration
4. **Zustand State Management**: Lightweight alternative to Redux for simpler state logic
5. **Component Architecture**: Modular React components with clear separation of concerns
6. **Free Access Model**: All premium features are available for free to maximize educational access
7. **Progressive Enhancement**: Features degrade gracefully when advanced APIs aren't available
8. **Real-time Capabilities**: Supabase integration enables collaborative features and live updates

The architecture prioritizes educational accessibility, scalable feature development, and maintainable code structure while providing advanced interactive learning experiences.