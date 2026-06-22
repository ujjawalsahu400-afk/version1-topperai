import React from "react";
import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ChevronLeft, GraduationCap } from "lucide-react-native";
import { useRouter } from "expo-router";
import { cn } from "@/utils/cn";

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  showBackButton?: boolean;
}

export const AuthLayout = ({
  children,
  title,
  subtitle,
  showBackButton = true,
}: AuthLayoutProps) => {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-slate-900">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
          className="px-8"
        >
          {/* Header */}
          <View className="flex-row items-center justify-between mt-6 mb-10">
            {showBackButton ? (
              <TouchableOpacity
                onPress={() => router.back()}
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

          {/* Title Section */}
          <View className="mb-8">
            <Text className="text-3xl font-bold text-slate-900 dark:text-white">
              {title}
            </Text>
            {subtitle && (
              <Text className="text-slate-500 dark:text-slate-400 mt-2 text-base font-medium">
                {subtitle}
              </Text>
            )}
          </View>

          {/* Form Content */}
          <View className="flex-1 pb-10">
            {children}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};
