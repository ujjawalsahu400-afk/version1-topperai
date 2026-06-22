import { create } from 'zustand';
import { doc, getDoc, updateDoc, increment, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface ProfileStats {
  xp: number;
  coins: number;
  level: number;
  streak: number;
  notesGenerated: number;
  quizzesCompleted: number;
  lastActive?: number;
}

interface ProfileState {
  stats: ProfileStats;
  isLoading: boolean;

  // Actions
  loadProfile: (userId: string) => Promise<void>;
  addXP: (amount: number, userId: string) => Promise<void>;
  addCoins: (amount: number, userId: string) => Promise<void>;
  updateActivity: (userId: string) => Promise<void>;
  incrementNotes: (userId: string) => Promise<void>;
}

const INITIAL_STATS: ProfileStats = {
  xp: 0,
  coins: 0,
  level: 1,
  streak: 0,
  notesGenerated: 0,
  quizzesCompleted: 0,
};

export const useProfileStore = create<ProfileState>((set, get) => ({
  stats: INITIAL_STATS,
  isLoading: false,

  loadProfile: async (userId) => {
    set({ isLoading: true });
    try {
      const docRef = doc(db, 'users', userId);
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        set({ stats: { ...INITIAL_STATS, ...snap.data() } });
      } else {
        await setDoc(docRef, INITIAL_STATS);
        set({ stats: INITIAL_STATS });
      }
    } catch (err) {
      console.error('Load profile error:', err);
    } finally {
      set({ isLoading: false });
    }
  },

  addXP: async (amount, userId) => {
    const { stats } = get();
    const newXp = stats.xp + amount;
    const newLevel = Math.floor(newXp / 1000) + 1;

    set((state) => ({
      stats: { ...state.stats, xp: newXp, level: newLevel }
    }));

    try {
      const docRef = doc(db, 'users', userId);
      await updateDoc(docRef, {
        xp: increment(amount),
        level: newLevel
      });
    } catch (err) {
      console.error('Add XP error:', err);
    }
  },

  addCoins: async (amount, userId) => {
    set((state) => ({
      stats: { ...state.stats, coins: state.stats.coins + amount }
    }));
    try {
      const docRef = doc(db, 'users', userId);
      await updateDoc(docRef, { coins: increment(amount) });
    } catch (err) {
      console.error('Add coins error:', err);
    }
  },

  updateActivity: async (userId) => {
    const now = Date.now();
    const { stats } = get();
    let newStreak = stats.streak;

    if (stats.lastActive) {
      const hoursSince = (now - stats.lastActive) / (1000 * 60 * 60);
      if (hoursSince > 24 && hoursSince < 48) {
        newStreak += 1;
      } else if (hoursSince >= 48) {
        newStreak = 1;
      }
    } else {
      newStreak = 1;
    }

    set((state) => ({
      stats: { ...state.stats, streak: newStreak, lastActive: now }
    }));

    try {
      const docRef = doc(db, 'users', userId);
      await updateDoc(docRef, { streak: newStreak, lastActive: now });
    } catch (err) {
      console.error('Update activity error:', err);
    }
  },

  incrementNotes: async (userId) => {
    set((state) => ({
      stats: { ...state.stats, notesGenerated: state.stats.notesGenerated + 1 }
    }));
    try {
      const docRef = doc(db, 'users', userId);
      await updateDoc(docRef, { notesGenerated: increment(1) });
    } catch (err) {
      console.error('Increment notes error:', err);
    }
  }
}));
