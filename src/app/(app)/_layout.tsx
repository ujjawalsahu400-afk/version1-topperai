import React from "react";
import { Drawer } from "expo-router/drawer";
import { DrawerContent } from "@/features/navigation/components/DrawerContent";
import { Platform } from "react-native";

export default function AppLayout() {
  return (
    <Drawer
      drawerContent={(props) => <DrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        drawerType: Platform.OS === "web" ? "permanent" : "front",
        drawerStyle: {
          width: 300,
          backgroundColor: "white",
        },
        swipeEdgeWidth: 100,
      }}
    >
      <Drawer.Screen
        name="ai-chat/index"
        options={{ title: "AI Chat" }}
      />
      <Drawer.Screen
        name="notes/index"
        options={{ title: "Notes" }}
      />
      <Drawer.Screen
        name="quiz/index"
        options={{ title: "Quiz" }}
      />
      <Drawer.Screen
        name="mock-tests/index"
        options={{ title: "Mock Tests" }}
      />
      <Drawer.Screen
        name="study-planner/index"
        options={{ title: "Study Planner" }}
      />
      <Drawer.Screen
        name="community/index"
        options={{ title: "Community" }}
      />
      <Drawer.Screen
        name="analytics/index"
        options={{ title: "Analytics" }}
      />
      <Drawer.Screen
        name="profile/index"
        options={{ title: "Profile" }}
      />
      <Drawer.Screen
        name="settings/index"
        options={{ title: "Settings" }}
      />

      {/* Hidden Screens */}
      <Drawer.Screen
        name="(tabs)"
        options={{ drawerItemStyle: { display: 'none' } }}
      />
    </Drawer>
  );
}
