import { Stack } from "expo-router";
import { AppProvider } from "@/providers/AppProvider";
import "../global.css";

// Prevent the splash screen from auto-hiding before asset loading is complete.
// import * as SplashScreen from 'expo-splash-screen';
// SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  return (
    <AppProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </AppProvider>
  );
}
