import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Settings, Share2, BadgeCheck } from "lucide-react-native";
import { ProfileAvatar } from "./ProfileAvatar";
import { UserProfile } from "@/types/profile";
import { useRouter } from "expo-router";

interface ProfileHeaderProps {
  profile: UserProfile;
  isOwnProfile?: boolean;
}

export const ProfileHeader = ({ profile, isOwnProfile = false }: ProfileHeaderProps) => {
  const router = useRouter();

  return (
    <View className="px-8 pt-6 pb-8 bg-white dark:bg-slate-900 rounded-b-[48px] shadow-sm">
      <View className="flex-row justify-between items-center mb-6">
        <Text className="text-2xl font-bold text-slate-900 dark:text-white">Profile</Text>
        <View className="flex-row space-x-3">
          <TouchableOpacity className="w-10 h-10 bg-slate-50 dark:bg-slate-800 rounded-xl items-center justify-center">
            <Share2 size={20} color="#64748B" />
          </TouchableOpacity>
          {isOwnProfile && (
            <TouchableOpacity
              onPress={() => router.push("/(app)/profile/edit")}
              className="w-10 h-10 bg-slate-50 dark:bg-slate-800 rounded-xl items-center justify-center"
            >
              <Settings size={20} color="#64748B" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View className="items-center">
        <ProfileAvatar
          uri={profile.photoUrl}
          size="xl"
          isEditable={isOwnProfile}
          onPress={isOwnProfile ? () => router.push("/(app)/profile/edit") : undefined}
        />

        <View className="items-center mt-4">
          <View className="flex-row items-center">
            <Text className="text-2xl font-bold text-slate-900 dark:text-white">
              {profile.name}
            </Text>
            {profile.subscriptionPlan !== 'Free' && (
              <View className="ml-1.5">
                <BadgeCheck size={20} color="#208AEF" fill="#208AEF" strokeWidth={1} />
              </View>
            )}
          </View>

          <Text className="text-slate-500 dark:text-slate-400 font-medium text-base mt-1">
            @{profile.userId}
          </Text>

          <View className="bg-primary/10 px-3 py-1 rounded-full mt-3">
            <Text className="text-primary font-bold text-xs uppercase tracking-widest">
              Class {profile.class} • {profile.school || 'Self Learner'}
            </Text>
          </View>

          {profile.bio && (
            <Text className="text-slate-500 dark:text-slate-400 text-center mt-4 px-6 leading-5">
              {profile.bio}
            </Text>
          )}
        </View>
      </View>
    </View>
  );
};
