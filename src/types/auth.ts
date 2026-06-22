/**
 * Global Authentication and User Types
 * Strictly typed to prevent runtime null-reference errors.
 */

export interface User {
  id: string;
  name: string;
  userId: string;
  email: string;
  class?: string;
  school?: string;
  profilePhoto?: string;
  level?: number;
  xp?: number;
  coins?: number;
  streak?: number;
}

export interface LoginForm {
  email: string;
  password?: string;
  rememberMe: boolean;
}

export interface SignupForm {
  name: string;
  userId: string;
  email: string;
  password?: string;
  confirmPassword?: string;
}

export interface ProfileSetupForm {
  profilePhoto?: string;
  class: string;
  school?: string;
}

/**
 * Clerk User Interface Bridge
 * Maps Clerk's complex object to TopperAI's internal User interface
 */
export interface ClerkUserBridge {
  id: string;
  fullName: string | null;
  primaryEmailAddress: {
    emailAddress: string;
  } | null;
  imageUrl: string;
}
