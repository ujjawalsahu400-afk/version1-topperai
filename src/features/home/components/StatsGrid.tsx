import React from "react";
import { View, Text } from "react-native";
import { DashboardData } from "@/types/home";

interface StatsGridProps {
  stats: DashboardData['stats'];
}

export const StatsGrid = ({ stats }: StatsGridProps) => {
  return (
    <View className="px-8 mt-6">
      <Text className="text-xl font-bold text-slate-900 dark:text-white mb-6">Study Overview</Text>
      <View className="flex-row flex-wrap justify-between">
        <StatCard label="Notes" value={stats.totalNotes} color="bg-blue-100" textColor="text-blue-600" />
        <StatCard label="Quizzes" value={stats.totalQuizzes} color="bg-purple-100" textColor="text-purple-600" />
        <StatCard label="Time" value={stats.totalStudyTime} color="bg-orange-100" textColor="text-orange-600" />
        <StatCard label="Accuracy" value={`${stats.accuracy}%`} color="bg-emerald-100" textColor="text-emerald-600" />
      </View>
    </View>
  );
};

const StatCard = ({ label, value, color, textColor }: { label: string; value: string | number; color: string; textColor: string }) => (
  <View className="w-[23%] bg-white dark:bg-slate-900 p-3 rounded-2xl border border-slate-50 dark:border-slate-800 items-center shadow-sm mb-4">
    <Text className={`text-base font-bold ${textColor}`}>{value}</Text>
    <Text className="text-[10px] text-slate-400 font-bold uppercase mt-1">{label}</Text>
  </View>
);
