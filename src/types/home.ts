export interface DashboardData {
  stats: {
    totalNotes: number;
    totalQuizzes: number;
    totalStudyTime: string;
    accuracy: number;
  };
  dailyGoal: {
    completed: number;
    total: number;
  };
  recentActivity: ActivityItem[];
  recommendation: {
    title: string;
    description: string;
  };
}

export interface ActivityItem {
  id: string;
  type: 'note' | 'quiz' | 'test';
  title: string;
  timestamp: string;
  status?: string;
}
