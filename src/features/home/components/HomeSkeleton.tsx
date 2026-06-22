import React from "react";
import { View, ScrollView } from "react-native";

export const HomeSkeleton = () => {
  return (
    <ScrollView className="flex-1 bg-white dark:bg-slate-950" showsVerticalScrollIndicator={false}>
      {/* Header Skeleton */}
      <View className="flex-row items-center justify-between px-8 pt-4 mb-6">
        <View className="flex-row items-center">
          <View className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full" />
          <View className="ml-3 space-y-2">
            <View className="w-24 h-4 bg-slate-100 dark:bg-slate-800 rounded-md" />
            <View className="w-32 h-6 bg-slate-100 dark:bg-slate-800 rounded-md" />
          </View>
        </View>
      </View>

      {/* XP Card Skeleton */}
      <View className="mx-8 h-48 bg-slate-100 dark:bg-slate-800 rounded-[32px] mb-10" />

      {/* Grid Skeleton */}
      <View className="px-8 flex-row flex-wrap justify-between">
        {[1, 2, 3, 4].map((i) => (
          <View key={i} className="w-[48%] h-32 bg-slate-100 dark:bg-slate-800 rounded-[32px] mb-4" />
        ))}
      </View>
    </ScrollView>
  );
};
