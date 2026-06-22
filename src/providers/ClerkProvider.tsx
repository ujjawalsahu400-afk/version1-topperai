import React from "react";
import { ClerkProvider as BaseClerkProvider, ClerkLoaded } from "@clerk/clerk-expo";
import { tokenCache } from "@/lib/clerk";
import { View, Text, Platform } from "react-native";

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;

export function ClerkProvider({ children }: { children: React.ReactNode }) {
  if (!publishableKey) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 20 }}>
        <Text style={{ fontSize: 18, fontWeight: "bold", color: "#EF4444", textAlign: "center" }}>
          Missing Clerk Publishable Key
        </Text>
        <Text style={{ marginTop: 10, textAlign: "center", color: "#64748B" }}>
          Please set EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY in your .env file and restart the development server.
        </Text>
      </View>
    );
  }

  return (
    <BaseClerkProvider
      tokenCache={Platform.OS !== 'web' ? tokenCache : undefined}
      publishableKey={publishableKey}
    >
      <ClerkLoaded>
        {children}
      </ClerkLoaded>
    </BaseClerkProvider>
  );
}
