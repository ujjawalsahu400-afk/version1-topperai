import { create } from 'zustand';
import { User, ClerkUserBridge } from '@/types/auth';
import { profileService } from '@/services/auth/profileService';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;

  // Actions
  setClerkUser: (clerkUser: ClerkUserBridge) => void;
  fetchProfile: (uid: string) => Promise<void>;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isLoading: true,
  isAuthenticated: false,
  error: null,

  setClerkUser: (clerkUser) => {
    // Map Clerk bridge to internal user
    const internalUser: User = {
      id: clerkUser.id,
      name: clerkUser.fullName || 'Student',
      email: clerkUser.primaryEmailAddress?.emailAddress || '',
      userId: clerkUser.id, // Fallback if internal ID not set
      profilePhoto: clerkUser.imageUrl,
    };

    set({
      user: internalUser,
      isAuthenticated: true,
      isLoading: false
    });
  },

  fetchProfile: async (uid) => {
    set({ isLoading: true });
    try {
      const profile = await profileService.getProfile(uid);
      if (profile) {
        set((state) => ({
          user: state.user ? { ...state.user, ...profile } : (profile as User),
          isLoading: false
        }));
      }
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  },

  setLoading: (loading) => set({ isLoading: loading }),

  setError: (error) => set({ error }),

  clearError: () => set({ error: null }),

  logout: () => {
    set({ user: null, isAuthenticated: false, isLoading: false, error: null });
  },
}));
