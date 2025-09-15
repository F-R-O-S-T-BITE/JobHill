# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

JobHill is a Next.js job platform application built with TypeScript, React 19, and Supabase for backend services. The app helps users find job opportunities with features like user authentication, job filtering, onboarding, and profile management.

## Development Commands

```bash
# Development
cd jobhill && npm run dev          # Start development server on localhost:3000
cd jobhill && npm run build        # Build for production
cd jobhill && npm start           # Start production server
cd jobhill && npm run lint         # Run ESLint

# The main project code is in the jobhill/ directory
```

## Architecture Overview

### Tech Stack
- **Frontend**: Next.js 15 with App Router, React 19, TypeScript
- **Styling**: Tailwind CSS v4 with custom breakpoints
- **Backend**: Supabase (authentication, database)
- **State Management**: TanStack Query (React Query) v5
- **UI Libraries**: Lucide React icons, React Hot Toast

### Project Structure
```
jobhill/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── (auth)/            # Auth route group
│   │   ├── api/               # API routes
│   │   ├── profile/           # User profile pages
│   │   └── opportunities/     # Job listings
│   ├── components/            # Reusable UI components
│   │   ├── Onboarding/        # User onboarding flow
│   │   ├── OfferCard/         # Job card components
│   │   ├── Modals/            # Modal components
│   │   └── Toast/             # Notification components
│   ├── utils/                 # Utility functions
│   │   └── supabase/          # Supabase client configuration
│   ├── hooks/                 # Custom React hooks
│   ├── interfaces/            # TypeScript interfaces
│   ├── contexts/              # React contexts
│   ├── providers/             # Provider components (QueryProvider)
│   └── styles/                # Style configurations
├── middleware.ts              # Next.js middleware for auth
└── public/                    # Static assets
```

### Authentication Flow
- Uses Supabase Auth with Next.js middleware
- Public routes: `/`, `/login`, `/register`, `/opportunities`, `/auth/*`
- Protected routes require authentication via middleware
- Session management handled through Supabase SSR utilities

### Key Components
- **ClientLayout**: Main app layout with authentication state
- **OnboardingModal**: Multi-step user onboarding process
- **DataFilter**: Job filtering and search functionality
- **OfferCard**: Job listing display components

### Database Integration
- Supabase client configured for both client and server-side usage
- Server actions and API routes for data operations
- Real-time subscriptions available through Supabase

### Styling System
- Tailwind CSS with custom screen breakpoints (xs: 320px to 5xl: 3840px)
- Custom fonts: Poppins and Inter
- Component-specific CSS modules where needed
- Responsive design optimized for mobile-first approach
- **Styling Preference**: Create classes in separate stylesheets rather than using inline Tailwind classes

### Development Approach
- **Guidance-focused**: Provide guidance and suggestions rather than implementing complete solutions
- Help users understand the codebase and suggest implementation approaches
- Encourage learning through step-by-step guidance

### Development Notes
- Uses TypeScript strict mode
- React Query for server state management and caching
- Custom hooks for common functionality
- Modular component architecture
- Environment variables stored in `.env.local`