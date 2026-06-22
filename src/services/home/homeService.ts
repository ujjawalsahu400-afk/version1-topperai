import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { DashboardData } from "@/types/home";

export const homeService = {
  async getDashboardData(uid: string): Promise<DashboardData> {
    // In a real app, you might fetch this from a 'dashboard' subcollection or calculate it
    // For now, returning mock data that looks production-ready
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          stats: {
            totalNotes: 24,
            totalQuizzes: 15,
            totalStudyTime: "12h 30m",
            accuracy: 85,
          },
          dailyGoal: {
            completed: 2,
            total: 5,
          },
          recentActivity: [
            { id: '1', type: 'note', title: 'Cell Biology - Mitochondria', timestamp: '2h ago' },
            { id: '2', type: 'quiz', title: 'Periodic Table Basics', timestamp: 'Yesterday', status: '8/10 Score' },
            { id: '3', type: 'test', title: 'Calculus Mock Test 1', timestamp: '3 days ago', status: 'Pending Review' },
          ],
          recommendation: {
            title: "Focus on Mathematics today",
            description: "Your quiz accuracy in Algebra dropped by 12% last week."
          }
        });
      }, 1000);
    });
  }
};
