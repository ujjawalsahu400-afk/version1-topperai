import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { ChevronRight, Trophy } from "lucide-react-native";
import { ProfileAvatar } from "./ProfileAvatar";
import { UserProfile } from "@/types/profile";
import { useRouter } from "expo-router";

interface UserCardProps {
  user: UserProfile;
}

export const UserCard = ({ user }: UserCardProps) => {
  const router = useRouter();

  return (
    <TouchableOpacity
      onPress={() => router.push(`/(app)/profile/${user.userId}`)}
      className="flex-row items-center bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-100 dark:border-slate-800 mb-3 shadow-sm"
    >
      <ProfileAvatar uri={user.photoUrl} size="md" />

      <View className="flex-1 ml-4">
        <Text className="text-slate-900 dark:text-white font-bold text-lg">{user.name}</Text>
        <Text className="text-slate-500 dark:text-slate-400 font-medium">@{user.userId}</Text>

        <View className="flex-row items-center mt-1">
          <View className="bg-secondary/10 px-2 py-0.5 rounded-md flex-row items-center">
            <Trophy size={12} color="#6D28D9" fill="#6D28D9" />
            <Text className="text-secondary font-bold text-[10px] ml-1 uppercase">Level {user.level}</Text>
          </View>
          <Text className="text-slate-400 text-xs ml-2">Class {user.class}</Text>
        </View>
      </View>

      <ChevronRight size={20} color="#94A3B8" />
    </TouchableOpacity>
  );
};
