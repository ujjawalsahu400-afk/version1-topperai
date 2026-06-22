import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Bell, Search } from "lucide-react-native";
import { ProfileAvatar } from "@/features/profile/components/ProfileAvatar";
import { UserProfile } from "@/types/profile";
import { useRouter } from "expo-router";

interface HomeHeaderProps {
  profile: UserProfile | null;
}

export const HomeHeader = ({ profile }: HomeHeaderProps) => {
  const router = useRouter();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  return (
    <View className="flex-row items-center justify-between px-8 pt-4 mb-6">
      <View className="flex-row items-center">
        <ProfileAvatar
          uri={profile?.photoUrl}
          size="md"
          onPress={() => router.push("/(app)/(tabs)/profile")}
        />
        <View className="ml-3">
          <Text className="text-slate-500 dark:text-slate-400 font-medium text-sm">
            {getGreeting()},
          </Text>
          <Text className="text-xl font-bold text-slate-900 dark:text-white">
            {profile?.name.split(' ')[0] || "Topper"} 👋
          </Text>
        </View>
      </View>

      <View className="flex-row space-x-3">
        <TouchableOpacity className="w-10 h-10 bg-white dark:bg-slate-800 rounded-2xl items-center justify-center shadow-sm border border-slate-50 dark:border-slate-800">
          <Search size={20} color="#64748B" />
        </TouchableOpacity>
        <TouchableOpacity className="w-10 h-10 bg-white dark:bg-slate-800 rounded-2xl items-center justify-center shadow-sm border border-slate-50 dark:border-slate-800">
          <Bell size={20} color="#64748B" />
          <View className="absolute top-2 right-2.5 w-2 h-2 bg-error rounded-full border-2 border-white dark:border-slate-800" />
        </TouchableOpacity>
      </View>
    </View>
  );
};
