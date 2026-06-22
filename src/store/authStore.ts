import { create } from 'zustand';
import { User, ClerkUserBridge, SignupForm, ProfileSetupForm } from '@/types/auth';
import { profileService } from '@/services/profile/profileService';

interface AuthState {
  user: User | null;
  pendingProfile: SignupForm | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;

  // Actions
  setClerkUser: (clerkUser: ClerkUserBridge) => void;
  setPendingProfile: (profile: SignupForm | null) => void;
  fetchProfile: (uid: string) => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  pendingProfile: null,
  isLoading: true,
  isAuthenticated: false,
  error: null,

  setClerkUser: (clerkUser) => {
    const internalUser: User = {
      id: clerkUser.id,
      name: clerkUser.fullName || 'Student',
      email: clerkUser.primaryEmailAddress?.emailAddress || '',
      userId: clerkUser.id,
      profilePhoto: clerkUser.imageUrl,
    };

    set({
      user: internalUser,
      isAuthenticated: true,
      isLoading: false
    });
  },

  setPendingProfile: (pendingProfile) => set({ pendingProfile }),

  fetchProfile: async (uid) => {
    set({ isLoading: true });
    try {
      const profile = await profileService.getProfile(uid);
      if (profile) {
        set((state) => ({
          user: state.user ? { ...state.user, ...profile } : (profile as unknown as User),
          isLoading: false
        }));
      }
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  },

  updateProfile: async (data) => {
    const { user } = get();
    if (!user?.id) return;

    set({ isLoading: true });
    try {
      await profileService.updateProfile(user.id, data as any);
      set((state) => ({
        user: state.user ? { ...state.user, ...data } : null,
        isLoading: false
      }));
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
      throw err;
    }
  },

  setLoading: (loading) => set({ isLoading: loading }),

  setError: (error) => set({ error }),

  clearError: () => set({ error: null }),

  logout: () => {
    set({ user: null, pendingProfile: null, isAuthenticated: false, isLoading: false, error: null });
  },
}));
