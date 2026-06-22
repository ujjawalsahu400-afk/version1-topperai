import { profileService } from "@/services/profile/profileService";

// This service wraps Clerk and Firestore operations
export const authService = {
  async handlePostSignup(uid: string, userData: any) {
    try {
      await profileService.createProfile(uid, uid, {
        email: userData.email,
        name: userData.name,
        userId: userData.userId,
      });
    } catch (error) {
      console.error("Error creating profile:", error);
      throw error;
    }
  },

  async handlePostProfileSetup(uid: string, profileData: any) {
    try {
      await profileService.updateProfile(uid, profileData);
    } catch (error) {
      console.error("Error updating profile:", error);
      throw error;
    }
  }
};
