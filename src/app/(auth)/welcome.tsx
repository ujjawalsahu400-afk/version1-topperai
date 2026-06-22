import React from "react";
import { View, Text, ScrollView, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Sparkles, Brain, Rocket, ArrowRight } from "lucide-react-native";
import { Button } from "@/components/ui/Button";

const FEATURE_LIST = [
  {
    icon: <Sparkles size={24} color="#F59E0B" />,
    title: "AI Notes Generator",
    desc: "Create detailed notes from any topic instantly."
  },
  {
    icon: <Brain size={24} color="#6D28D9" />,
    title: "Smart Doubts Solver",
    desc: "Get step-by-step explanations for your doubts."
  },
  {
    icon: <Rocket size={24} color="#10B981" />,
    title: "Exam Readiness",
    desc: "Practice with AI-generated mock tests."
  }
];

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-slate-900">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="px-8 py-10">
        <View className="items-center mb-12 mt-4">
          <View className="w-20 h-20 bg-primary/10 rounded-3xl items-center justify-center mb-6">
            <Brain size={40} color="#208AEF" />
          </View>
          <Text className="text-4xl font-bold text-slate-900 dark:text-white text-center">
            Master Any Subject
          </Text>
          <Text className="text-slate-500 dark:text-slate-400 text-center mt-3 text-lg font-medium px-4">
            Join the elite circle of students learning with the power of AI.
          </Text>
        </View>

        <View className="space-y-6 mb-12">
          {FEATURE_LIST.map((feature, index) => (
            <View key={index} className="flex-row items-center bg-slate-50 dark:bg-slate-800/50 p-5 rounded-3xl border border-slate-100 dark:border-slate-800">
              <View className="w-12 h-12 bg-white dark:bg-slate-800 rounded-2xl items-center justify-center shadow-sm">
                {feature.icon}
              </View>
              <View className="ml-4 flex-1">
                <Text className="text-slate-900 dark:text-white font-bold text-base">
                  {feature.title}
                </Text>
                <Text className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">
                  {feature.desc}
                </Text>
              </View>
            </View>
          ))}
        </View>

        <View className="mt-auto space-y-4">
          <Button
            title="Create Account"
            size="lg"
            onPress={() => router.push("/(auth)/signup")}
            icon={<ArrowRight size={20} color="white" />}
            iconPosition="right"
          />
          <Button
            title="Login to Account"
            variant="ghost"
            size="lg"
            onPress={() => router.push("/(auth)/login")}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
