import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { ChevronLeft, GraduationCap } from "lucide-react-native";
import { useRouter } from "expo-router";

interface AuthHeaderProps {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  onBack?: () => void;
}

export const AuthHeader = ({ title, subtitle, showBack = true, onBack }: AuthHeaderProps) => {
  const router = useRouter();

  return (
    <View className="mb-8">
      <View className="flex-row items-center justify-between mb-8">
        {showBack ? (
          <TouchableOpacity
            onPress={onBack || (() => router.back())}
            className="w-12 h-12 items-center justify-center rounded-2xl border border-slate-100 dark:border-slate-800"
          >
            <ChevronLeft size={24} color="#64748B" />
          </TouchableOpacity>
        ) : (
          <View className="w-12 h-12" />
        )}

        <View className="w-12 h-12 bg-primary rounded-2xl items-center justify-center shadow-lg shadow-primary/30">
          <GraduationCap size={24} color="white" />
        </View>

        <View className="w-12 h-12" />
      </View>

      <Text className="text-3xl font-bold text-slate-900 dark:text-white">
        {title}
      </Text>
      {subtitle && (
        <Text className="text-slate-500 dark:text-slate-400 mt-2 text-base font-medium">
          {subtitle}
        </Text>
      )}
    </View>
  );
};
