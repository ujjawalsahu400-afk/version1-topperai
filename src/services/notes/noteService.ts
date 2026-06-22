import { collection, doc, getDoc, setDoc, updateDoc, deleteDoc, query, where, orderBy, getDocs, addDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "@/lib/firebase";
import { Note, NoteType, NoteSource } from "@/features/notes/types/note";

export const noteService = {
  async saveNote(userId: string, data: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) {
    const notesRef = collection(db, "notes");
    const docRef = await addDoc(notesRef, {
      ...data,
      userId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    // Track usage
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);
    if (userSnap.exists()) {
      await updateDoc(userRef, {
        totalNotes: (userSnap.data().totalNotes || 0) + 1,
        updatedAt: new Date().toISOString()
      });
    }

    return docRef.id;
  },

  async getNotes(userId: string, type?: NoteType) {
    let q = query(
      collection(db, "notes"),
      where("userId", "==", userId),
      orderBy("createdAt", "desc")
    );

    if (type) {
      q = query(q, where("type", "==", type));
    }

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Note[];
  },

  async deleteNote(noteId: string) {
    await deleteDoc(doc(db, "notes", noteId));
  },

  async uploadFile(userId: string, uri: string, type: 'pdf' | 'image') {
    const filename = `${Date.now()}.${type === 'pdf' ? 'pdf' : 'jpg'}`;
    const storageRef = ref(storage, `users/${userId}/notes_sources/${filename}`);

    const response = await fetch(uri);
    const blob = await response.blob();

    await uploadBytes(storageRef, blob);
    return getDownloadURL(storageRef);
  },

  async searchNotes(userId: string, searchTerm: string) {
    // Basic client-side filtering since Firestore doesn't support full-text search easily
    const notes = await this.getNotes(userId);
    return notes.filter(n =>
      n.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      n.content.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }
};
