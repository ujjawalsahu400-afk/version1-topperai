import { doc, getDoc, setDoc, updateDoc, query, collection, where, getDocs, limit, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { db, storage } from "@/lib/firebase";
import { UserProfile } from "@/types/profile";
import * as ImageManipulator from "expo-image-manipulator";

export const profileService = {
  async createProfile(uid: string, clerkId: string, data: Partial<UserProfile>) {
    const userRef = doc(db, "users", uid);
    const profile: UserProfile = {
      uid,
      clerkId,
      name: data.name || "",
      userId: data.userId || "",
      email: data.email || "",
      photoUrl: data.photoUrl || "",
      class: data.class || "",
      school: data.school || "",
      bio: "",
      xp: 0,
      coins: 0,
      level: 1,
      streak: 0,
      subscriptionPlan: "Free",
      totalNotes: 0,
      totalQuizzes: 0,
      totalBattles: 0,
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
      return docSnap.data() as UserProfile;
    }
    return null;
  },

  async updateProfile(uid: string, data: Partial<UserProfile>) {
    const userRef = doc(db, "users", uid);
    await updateDoc(userRef, {
      ...data,
      updatedAt: new Date().toISOString(),
    });
  },

  async uploadProfilePhoto(uid: string, uri: string) {
    // 1. Compress Image
    const manipulatedImage = await ImageManipulator.manipulateAsync(
      uri,
      [{ resize: { width: 400, height: 400 } }],
      { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
    );

    // 2. Fetch blob
    const response = await fetch(manipulatedImage.uri);
    const blob = await response.blob();

    // 3. Upload to Storage
    const storageRef = ref(storage, `profiles/${uid}/avatar.jpg`);
    await uploadBytes(storageRef, blob);

    // 4. Get Download URL
    const photoUrl = await getDownloadURL(storageRef);

    // 5. Update Firestore
    await this.updateProfile(uid, { photoUrl });

    return photoUrl;
  },

  async deleteProfilePhoto(uid: string) {
    const storageRef = ref(storage, `profiles/${uid}/avatar.jpg`);
    try {
      await deleteObject(storageRef);
    } catch (e) {
      console.log("File might not exist", e);
    }
    await this.updateProfile(uid, { photoUrl: "" });
  },

  async searchUserById(userId: string) {
    const q = query(
      collection(db, "users"),
      where("userId", "==", userId.toLowerCase().trim()),
      limit(1)
    );
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      return querySnapshot.docs[0].data() as UserProfile;
    }
    return null;
  },

  async checkUserIdAvailability(userId: string, currentUid?: string) {
    const q = query(
      collection(db, "users"),
      where("userId", "==", userId.toLowerCase().trim()),
      limit(1)
    );
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) return true;

    // If it belongs to current user, it's available
    if (currentUid && querySnapshot.docs[0].id === currentUid) return true;

    return false;
  }
};
