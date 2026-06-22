import { collection, addDoc, query, where, orderBy, getDocs, doc, deleteDoc, serverTimestamp, setDoc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { ChatMessage, ChatSession } from "@/features/ai-chat/types/chat";

export const chatHistoryService = {
  async saveChat(userId: string, messages: ChatMessage[], chatId?: string) {
    if (messages.length === 0) return chatId;

    const title = messages[0].content.substring(0, 40) + "...";
    const chatData = {
      userId,
      title,
      messages,
      lastMessage: messages[messages.length - 1].content,
      updatedAt: Date.now(), // Use primitive for easier client-side sorting if needed
    };

    if (chatId) {
      const chatRef = doc(db, "ai_chats", chatId);
      await setDoc(chatRef, chatData, { merge: true });
      return chatId;
    } else {
      const chatRef = collection(db, "ai_chats");
      const docRef = await addDoc(chatRef, {
        ...chatData,
        createdAt: Date.now(),
      });
      return docRef.id;
    }
  },

  async getChatMessages(chatId: string): Promise<ChatMessage[]> {
    const chatRef = doc(db, "ai_chats", chatId);
    const chatDoc = await getDoc(chatRef);
    if (chatDoc.exists()) {
      return chatDoc.data().messages || [];
    }
    return [];
  },

  async getUserChats(userId: string): Promise<ChatSession[]> {
    try {
      // Primary attempt: Optimized query (requires composite index)
      const q = query(
        collection(db, "ai_chats"),
        where("userId", "==", userId),
        orderBy("updatedAt", "desc")
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as unknown as ChatSession[];
    } catch (error: any) {
      // Fallback: Client-side sorting if index is missing
      if (error.message?.includes("index")) {
        console.warn("Firestore index missing. Falling back to client-side sort.");
        const fallbackQ = query(
          collection(db, "ai_chats"),
          where("userId", "==", userId)
        );
        const snapshot = await getDocs(fallbackQ);
        const chats = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as unknown as ChatSession[];

        return chats.sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));
      }
      throw error;
    }
  },

  async deleteChat(chatId: string) {
    await deleteDoc(doc(db, "ai_chats", chatId));
  }
};
