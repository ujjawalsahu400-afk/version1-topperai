import { create } from 'zustand';
import { collection, addDoc, query, where, getDocs, deleteDoc, doc, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { notesService, NoteType } from '@/services/ai/notesService';

export interface SavedNote {
  id: string;
  userId: string;
  title: string;
  content: string;
  type: NoteType;
  createdAt: number;
}

interface NotesState {
  savedNotes: SavedNote[];
  isGenerating: boolean;
  isLoading: boolean;

  // Actions
  generateAndSave: (userId: string, title: string, source: string, type: NoteType) => Promise<void>;
  loadSavedNotes: (userId: string) => Promise<void>;
  deleteNote: (noteId: string) => Promise<void>;
}

export const useNotesStore = create<NotesState>((set, get) => ({
  savedNotes: [],
  isGenerating: false,
  isLoading: false,

  generateAndSave: async (userId, title, source, type) => {
    set({ isGenerating: true });
    try {
      const content = await notesService.generateNotes(source, type);
      const noteData = {
        userId,
        title,
        content,
        type,
        createdAt: Date.now()
      };

      const docRef = await addDoc(collection(db, 'saved_notes'), noteData);

      set(state => ({
        savedNotes: [{ id: docRef.id, ...noteData }, ...state.savedNotes]
      }));
    } catch (err) {
      console.error('Generate notes error:', err);
    } finally {
      set({ isGenerating: false });
    }
  },

  loadSavedNotes: async (userId) => {
    set({ isLoading: true });
    try {
      const q = query(
        collection(db, 'saved_notes'),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );
      const snap = await getDocs(q);
      const notes = snap.docs.map(d => ({ id: d.id, ...d.data() })) as SavedNote[];
      set({ savedNotes: notes });
    } catch (err: any) {
      if (err.message?.includes("index")) {
        console.warn("Firestore index missing for notes. Falling back to client-side sort.");
        const fallbackQ = query(
          collection(db, 'saved_notes'),
          where('userId', '==', userId)
        );
        const snapshot = await getDocs(fallbackQ);
        const notes = snapshot.docs.map(d => ({ id: d.id, ...d.data() })) as SavedNote[];
        set({ savedNotes: notes.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0)) });
      } else {
        console.error('Load notes error:', err);
      }
    } finally {
      set({ isLoading: false });
    }
  },

  deleteNote: async (noteId) => {
    try {
      await deleteDoc(doc(db, 'saved_notes', noteId));
      set(state => ({
        savedNotes: state.savedNotes.filter(n => n.id !== noteId)
      }));
    } catch (err) {
      console.error('Delete note error:', err);
    }
  }
}));
