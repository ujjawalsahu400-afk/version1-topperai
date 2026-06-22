import React from "react";
import { View, Text } from "react-native";
import { Zap, Coins, Trophy, Flame } from "lucide-react-native";
import { cn } from "@/utils/cn";

interface StatItemProps {
  icon: React.ReactNode;
  value: string | number;
  label: string;
  color: string;
}

const StatItem = ({ icon, value, label, color }: StatItemProps) => (
  <View className="items-center flex-1">
    <View className={cn("w-12 h-12 rounded-2xl items-center justify-center mb-2 shadow-sm", color)}>
      {icon}
    </View>
    <Text className="text-lg font-bold text-slate-900 dark:text-white">{value}</Text>
    <Text className="text-[10px] uppercase tracking-widest text-slate-500 dark:text-slate-400 font-bold">
      {label}
    </Text>
  </View>
);

interface ProfileStatsCardProps {
  xp: number;
  coins: number;
  level: number;
  streak: number;
  className?: string;
}

export const ProfileStatsCard = ({ xp, coins, level, streak, className }: ProfileStatsCardProps) => {
  return (
    <View className={cn("bg-white dark:bg-slate-900 p-6 rounded-[32px] flex-row shadow-sm border border-slate-50 dark:border-slate-800", className)}>
      <StatItem
        icon={<Zap size={22} color="white" fill="white" />}
        value={xp}
        label="XP"
        color="bg-primary"
      />
      <StatItem
        icon={<Coins size={22} color="white" fill="white" />}
        value={coins}
        label="Coins"
        color="bg-accent"
      />
      <StatItem
        icon={<Trophy size={22} color="white" fill="white" />}
        value={level}
        label="Level"
        color="bg-secondary"
      />
      <StatItem
        icon={<Flame size={22} color="white" fill="white" />}
        value={streak}
        label="Streak"
        color="bg-error"
      />
    </View>
  );
};
