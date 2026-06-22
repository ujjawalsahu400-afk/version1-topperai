export interface UserProfile {
  uid: string;
  clerkId: string;

  name: string;
  userId: string; // Unique searchable ID
  email: string;
  photoUrl?: string;

  class: string;
  school?: string;
  bio?: string;

  // Gamification
  xp: number;
  coins: number;
  level: number;
  streak: number;

  // Subscription
  subscriptionPlan: 'Free' | 'Pro' | 'Premium';

  // Stats
  totalNotes: number;
  totalQuizzes: number;
  totalBattles: number;

  createdAt: string;
  updatedAt: string;
}

export interface SearchResult {
  uid: string;
  name: string;
  userId: string;
  photoUrl?: string;
  level: number;
}
