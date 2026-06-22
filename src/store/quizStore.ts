import { create } from 'zustand';
import { collection, addDoc, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { quizService, QuestionType, QuizDifficulty } from '@/services/ai/quizService';

export interface QuizQuestion {
  question: string;
  options?: string[];
  answer: string;
  explanation: string;
}

export interface SavedQuiz {
  id: string;
  userId: string;
  title: string;
  questions: QuizQuestion[];
  score?: number;
  difficulty: QuizDifficulty;
  createdAt: number;
}

interface QuizState {
  currentQuestions: QuizQuestion[];
  pastQuizzes: SavedQuiz[];
  isGenerating: boolean;

  // Actions
  generateQuiz: (prompt: string, type: QuestionType, difficulty: QuizDifficulty) => Promise<void>;
  saveQuizResult: (userId: string, title: string, questions: QuizQuestion[], score: number, difficulty: QuizDifficulty) => Promise<void>;
  loadPastQuizzes: (userId: string) => Promise<void>;
}

export const useQuizStore = create<QuizState>((set, get) => ({
  currentQuestions: [],
  pastQuizzes: [],
  isGenerating: false,

  generateQuiz: async (prompt, type, difficulty) => {
    set({ isGenerating: true, currentQuestions: [] });
    try {
      const questions = await quizService.generateQuiz(prompt, type, difficulty);
      set({ currentQuestions: questions });
    } catch (err) {
      console.error('Generate quiz error:', err);
    } finally {
      set({ isGenerating: false });
    }
  },

  saveQuizResult: async (userId, title, questions, score, difficulty) => {
    try {
      const quizData = {
        userId,
        title,
        questions,
        score,
        difficulty,
        createdAt: Date.now()
      };
      await addDoc(collection(db, 'saved_quizzes'), quizData);
      get().loadPastQuizzes(userId);
    } catch (err) {
      console.error('Save quiz error:', err);
    }
  },

  loadPastQuizzes: async (userId) => {
    try {
      const q = query(
        collection(db, 'saved_quizzes'),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );
      const snap = await getDocs(q);
      const quizzes = snap.docs.map(d => ({ id: d.id, ...d.data() })) as SavedQuiz[];
      set({ pastQuizzes: quizzes });
    } catch (err) {
      console.error('Load past quizzes error:', err);
    }
  }
}));
