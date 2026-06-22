# TopperAI: Production MVP Implementation Plan

TopperAI is an AI-first education platform. This plan details the completion of the full application, covering all requested features from Generators to Subscriptions.

## Core Architecture
- **Navigation**: Drawer-based (`expo-router/drawer`), AI-Chat as the initial route.
- **State**: Modular Zustand stores for Auth, Chat, Notes, Quizzes, Profile (XP/Coins), and Subscriptions.
- **Backend**: Firebase Firestore (Data), Storage (PDFs/Images), Clerk (Auth).
- **AI**: OpenRouter (LLM orchestrator).

## Phase 1: Gamification & Profile Engine
- **[NEW] [profileStore.ts](file:///C:/project/TopperAI/src/store/profileStore.ts)**: Manage XP, Coins, Streaks, and Level logic.
- **[NEW] [ProfileScreen.tsx](file:///C:/project/TopperAI/src/features/profile/screens/ProfileScreen.tsx)**: Full profile management with stats and level progression.

## Phase 2: AI Education Modules
### Notes Generator
- **[NEW] [notesStore.ts](file:///C:/project/TopperAI/src/store/notesStore.ts)**
- **[NEW] [NotesScreen.tsx](file:///C:/project/TopperAI/src/features/notes/screens/NotesScreen.tsx)**: Support for Short, Detailed, and Revision notes.
- **[NEW] [notesService.ts](file:///C:/project/TopperAI/src/services/ai/notesService.ts)**

### Quiz & Mock Tests
- **[NEW] [quizStore.ts](file:///C:/project/TopperAI/src/store/quizStore.ts)**
- **[NEW] [QuizScreen.tsx](file:///C:/project/TopperAI/src/features/quiz/screens/QuizScreen.tsx)**: MCQ, True/False, Fill-in-the-Blanks.
- **[NEW] [quizService.ts](file:///C:/project/TopperAI/src/services/ai/quizService.ts)**

### Study Planner
- **[NEW] [PlannerScreen.tsx](file:///C:/project/TopperAI/src/features/study-planner/screens/PlannerScreen.tsx)**: AI-generated daily/weekly/monthly schedules.

## Phase 3: Community & Social
- **[NEW] [CommunityScreen.tsx](file:///C:/project/TopperAI/src/features/community/screens/CommunityScreen.tsx)**: Shared notes and doubts forum.
- **[NEW] [communityService.ts](file:///C:/project/TopperAI/src/services/community/communityService.ts)**

## Phase 4: Monetization & Analytics
- **[NEW] [subscriptionStore.ts](file:///C:/project/TopperAI/src/store/subscriptionStore.ts)**: RevenueCat integration wrapper.
- **[NEW] [AnalyticsScreen.tsx](file:///C:/project/TopperAI/src/features/analytics/screens/AnalyticsScreen.tsx)**: Comprehensive study insights.

## Phase 5: Security & Optimization
- **[NEW] [firestore.rules](file:///C:/project/TopperAI/firestore.rules)**: Production security rules.
- **Performance**: memoization audit across all new screens.

---

## Verification Plan
1. **Vertical Slice Testing**: Verify each feature (e.g., Notes) from UI -> Store -> AI Service -> Firestore.
2. **Persistence Check**: Ensure XP and generated content survive app restarts.
3. **Monetization Simulation**: Test paywall triggers for Pro features.
