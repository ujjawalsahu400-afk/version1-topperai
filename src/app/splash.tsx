import React, { useEffect } from "react";
import { View, Text, Animated } from "react-native";
import { GraduationCap } from "lucide-react-native";
import { useRouter } from "expo-router";
import { useAuthStore } from "@/store/useAuthStore";

export default function SplashScreen() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const fadeAnim = new Animated.Value(0);
  const scaleAnim = new Animated.Value(0.8);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,
        useNativeDriver: true,
      }),
    ]).start();

    const timer = setTimeout(() => {
      if (isAuthenticated) {
        router.replace("/(tabs)"); // Assuming tabs exists or design system for now
      } else {
        router.replace("/");
      }
    }, 2500);

    return () => clearTimeout(timer);
  }, [isAuthenticated]);

  return (
    <View className="flex-1 bg-primary items-center justify-center">
      <Animated.View
        style={{
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }],
        }}
        className="items-center"
      >
        <View className="w-24 h-24 bg-white rounded-[32px] items-center justify-center shadow-2xl">
          <GraduationCap size={48} color="#208AEF" />
        </View>
        <Text className="text-4xl font-bold text-white mt-6 tracking-tight">
          Topper<Text className="text-slate-100/80">AI</Text>
        </Text>
        <View className="absolute -bottom-20">
          <Text className="text-white/60 font-medium tracking-widest text-xs uppercase">
            Personalized Learning
          </Text>
        </View>
      </Animated.View>
    </View>
  );
}
