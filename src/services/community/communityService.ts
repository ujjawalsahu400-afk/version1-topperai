import { collection, addDoc, query, orderBy, limit, getDocs, serverTimestamp, doc, updateDoc, increment } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface Post {
  id: string;
  userId: string;
  userName: string;
  title: string;
  content: string;
  type: 'doubt' | 'notes' | 'discussion';
  likes: number;
  commentsCount: number;
  createdAt: any;
}

export const communityService = {
  async createPost(userId: string, userName: string, title: string, content: string, type: string) {
    const postData = {
      userId,
      userName,
      title,
      content,
      type,
      likes: 0,
      commentsCount: 0,
      createdAt: serverTimestamp()
    };
    return await addDoc(collection(db, 'posts'), postData);
  },

  async getLatestPosts(limitCount: number = 20): Promise<Post[]> {
    const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'), limit(limitCount));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() })) as Post[];
  },

  async likePost(postId: string) {
    const ref = doc(db, 'posts', postId);
    await updateDoc(ref, { likes: increment(1) });
  }
};
