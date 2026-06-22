import React from "react";
import { View, Text } from "react-native";
import { Sparkles, Target } from "lucide-react-native";

interface DailyGoalCardProps {
  completed: number;
  total: number;
}

export const DailyGoalCard = ({ completed, total }: DailyGoalCardProps) => {
  const progress = (completed / total) * 100;

  return (
    <View className="px-8 mt-6">
      <View className="bg-slate-900 dark:bg-slate-800 p-6 rounded-[32px] shadow-lg">
        <View className="flex-row items-center mb-4">
          <View className="w-10 h-10 bg-white/10 rounded-xl items-center justify-center mr-3">
            <Target size={20} color="#10B981" />
          </View>
          <View>
            <Text className="text-white font-bold text-base">Daily Study Goal</Text>
            <Text className="text-slate-400 text-xs">{completed} of {total} hours completed</Text>
          </View>
        </View>

        <View className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
          <View className="h-full bg-emerald-500 rounded-full" style={{ width: `${progress}%` }} />
        </View>
      </View>
    </View>
  );
};

interface AIRecommendationCardProps {
  recommendation: {
    title: string;
    description: string;
  };
}

export const AIRecommendationCard = ({ recommendation }: AIRecommendationCardProps) => {
  return (
    <View className="px-8 mt-6">
      <View className="bg-amber-50 dark:bg-amber-900/20 p-6 rounded-[32px] border border-amber-100 dark:border-amber-800/30">
        <View className="flex-row items-center mb-3">
          <Sparkles size={20} color="#F59E0B" />
          <Text className="text-amber-900 dark:text-amber-400 font-bold ml-2">AI Recommendation</Text>
        </View>
        <Text className="text-slate-900 dark:text-white font-bold text-base mb-1">{recommendation.title}</Text>
        <Text className="text-slate-500 dark:text-slate-400 text-sm leading-5">{recommendation.description}</Text>
      </View>
    </View>
  );
};
