import { create } from 'zustand';
import { DashboardData } from '@/types/home';

interface HomeState {
  dashboardData: DashboardData | null;
  isLoading: boolean;
  error: string | null;

  setDashboardData: (data: DashboardData | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useHomeStore = create<HomeState>((set) => ({
  dashboardData: null,
  isLoading: false,
  error: null,

  setDashboardData: (dashboardData) => set({ dashboardData, isLoading: false }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error, isLoading: false }),
}));
