import { doc, getDoc, setDoc, updateDoc, query, collection, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { User } from "@/types/auth";

export const profileService = {
  async createProfile(uid: string, data: Partial<User>) {
    const userRef = doc(db, "users", uid);
    const profile = {
      uid,
      userId: data.userId || "",
      name: data.name || "",
      email: data.email || "",
      class: data.class || "",
      school: data.school || "",
      photoUrl: data.profilePhoto || "",
      xp: 0,
      coins: 0,
      streak: 0,
      level: 1,
      subscriptionPlan: "Free",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    await setDoc(userRef, profile);
    return profile;
  },

  async getProfile(uid: string) {
    const userRef = doc(db, "users", uid);
    const docSnap = await getDoc(userRef);
    if (docSnap.exists()) {
      return docSnap.data() as User;
    }
    return null;
  },

  async updateProfile(uid: string, data: Partial<User>) {
    const userRef = doc(db, "users", uid);
    await updateDoc(userRef, {
      ...data,
      updatedAt: new Date().toISOString(),
    });
  },

  async searchUserById(userId: string) {
    const q = query(collection(db, "users"), where("userId", "==", userId));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      return querySnapshot.docs[0].data() as User;
    }
    return null;
  }
};
