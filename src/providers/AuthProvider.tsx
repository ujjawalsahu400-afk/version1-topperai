import React, { useEffect } from "react";
import { useAuth, useUser } from "@clerk/clerk-expo";
import { useRouter, useSegments } from "expo-router";
import { useAuthStore } from "@/store/authStore";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { isLoaded, isSignedIn } = useAuth();
  const { user: clerkUser } = useUser();
  const segments = useSegments();
  const router = useRouter();

  const { setClerkUser, fetchProfile, logout: clearStore } = useAuthStore();

  useEffect(() => {
    // Wait for Clerk to load its initial state
    if (!isLoaded) return;

    const inAuthGroup = segments[0] === "(auth)";

    if (isSignedIn && clerkUser) {
      // USER IS SIGNED IN
      setClerkUser(clerkUser);
      fetchProfile(clerkUser.id);

      // If user is stuck in auth group (login/signup/splash) but is signed in, move them to home
      if (inAuthGroup) {
        router.replace("/(app)/ai-chat");
      }
    } else if (!isSignedIn) {
      // USER IS NOT SIGNED IN
      clearStore(); // Ensure local state is clean

      // If user is trying to access protected app routes, redirect to splash/login
      if (!inAuthGroup) {
        router.replace("/(auth)/splash");
      }
    }
  }, [isSignedIn, isLoaded, clerkUser, segments]);

  return <>{children}</>;
}
