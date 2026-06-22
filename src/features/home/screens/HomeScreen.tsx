import React from "react";
import { View, ScrollView, RefreshControl } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { HomeHeader } from "../components/HomeHeader";
import { XPCard } from "../components/XPCard";
import { QuickActionGrid } from "../components/QuickActionGrid";
import { StatsGrid } from "../components/StatsGrid";
import { RecentActivity } from "../components/RecentActivity";
import { DailyGoalCard, AIRecommendationCard } from "../components/DashboardCards";
import { HomeSkeleton } from "../components/HomeSkeleton";
import { useAuthStore } from "@/store/authStore";
import { useDashboard } from "@/hooks/useDashboard";
import { useProfile } from "@/hooks/useProfile";

export default function HomeScreen() {
  const { user } = useAuthStore();
  const { profile, isLoading: isProfileLoading } = useProfile(user?.id);
  const { data: dashboard, isLoading: isDashboardLoading, refetch } = useDashboard(user?.id);

  if (isProfileLoading || isDashboardLoading) {
    return <HomeSkeleton />;
  }

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-slate-950" edges={['top']}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isDashboardLoading}
            onRefresh={refetch}
            tintColor="#208AEF"
          />
        }
      >
        <HomeHeader profile={profile || null} />

        <XPCard
          level={profile?.level || 1}
          xp={profile?.xp || 0}
          maxXp={1000}
          coins={profile?.coins || 0}
          streak={profile?.streak || 0}
        />

        {dashboard && (
          <>
            <AIRecommendationCard recommendation={dashboard.recommendation} />
            <QuickActionGrid />
            <DailyGoalCard completed={dashboard.dailyGoal.completed} total={dashboard.dailyGoal.total} />
            <StatsGrid stats={dashboard.stats} />
            <RecentActivity items={dashboard.recentActivity} />
          </>
        )}

        <View className="h-20" />
      </ScrollView>
    </SafeAreaView>
  );
}
