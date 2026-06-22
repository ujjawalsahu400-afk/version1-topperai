import React, { useEffect } from "react";
import { View, Text, Animated } from "react-native";
import { GraduationCap } from "lucide-react-native";
import { useRouter } from "expo-router";

export default function SplashScreen() {
  const router = useRouter();
  const fadeAnim = new Animated.Value(0);
  const scaleAnim = new Animated.Value(0.9);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,
        useNativeDriver: true,
      }),
    ]).start();

    const timer = setTimeout(() => {
      router.replace("/(auth)/welcome");
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

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
          Topper<Text className="text-white/70">AI</Text>
        </Text>
        <Text className="text-white/60 mt-2 font-medium tracking-widest text-sm uppercase">
          Learn Smarter with AI
        </Text>
      </Animated.View>
    </View>
  );
}
