import React, { useEffect, useState } from "react";
import { View, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams } from "expo-router";
import { ProfileHeader } from "@/features/profile/components/ProfileHeader";
import { ProfileStatsCard } from "@/features/profile/components/ProfileStatsCard";
import { profileService } from "@/services/profile/profileService";
import { UserProfile } from "@/types/profile";
import { Loader } from "@/components/ui/Loader";

export default function PublicProfileScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) {
      profileService.searchUserById(id).then(data => {
        setProfile(data);
        setIsLoading(false);
      });
    }
  }, [id]);

  if (isLoading) {
    return <Loader fullScreen />;
  }

  if (!profile) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-white dark:bg-slate-950">
        <Text className="text-slate-500">Profile not found</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-slate-50 dark:bg-slate-950" edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <ProfileHeader profile={profile} isOwnProfile={false} />

        <View className="px-8 -mt-10">
          <ProfileStatsCard
            xp={profile.xp}
            coins={profile.coins}
            level={profile.level}
            streak={profile.streak}
          />
        </View>

        <View className="px-8 py-10">
          {/* Publicly visible sections can go here */}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

import { Text } from "react-native";
