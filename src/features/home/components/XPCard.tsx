import React from "react";
import { View, Text } from "react-native";
import { Zap, Coins, Flame } from "lucide-react-native";

interface XPCardProps {
  level: number;
  xp: number;
  maxXp: number;
  coins: number;
  streak: number;
}

export const XPCard = ({ level, xp, maxXp, coins, streak }: XPCardProps) => {
  const progress = (xp / maxXp) * 100;

  return (
    <View className="mx-8 bg-primary p-6 rounded-[32px] shadow-xl shadow-primary/30">
      <View className="flex-row justify-between items-start mb-6">
        <View>
          <View className="bg-white/20 self-start px-3 py-1 rounded-full mb-1">
            <Text className="text-white font-bold text-[10px] uppercase tracking-widest">
              Level {level}
            </Text>
          </View>
          <Text className="text-white text-2xl font-bold">{xp} / {maxXp} XP</Text>
        </View>
        <View className="flex-row items-center bg-white/20 px-3 py-2 rounded-2xl">
          <Flame size={18} color="white" fill="white" />
          <Text className="text-white font-bold ml-1.5">{streak}</Text>
        </View>
      </View>

      {/* Progress Bar */}
      <View className="w-full h-3 bg-white/20 rounded-full overflow-hidden mb-6">
        <View
          className="h-full bg-white rounded-full"
          style={{ width: `${progress}%` }}
        />
      </View>

      <View className="flex-row items-center justify-between pt-4 border-t border-white/10">
        <View className="flex-row items-center">
          <View className="w-8 h-8 bg-accent rounded-xl items-center justify-center">
            <Coins size={16} color="white" fill="white" />
          </View>
          <View className="ml-2">
            <Text className="text-white/60 text-[10px] font-bold uppercase">Coins</Text>
            <Text className="text-white font-bold text-base">{coins}</Text>
          </View>
        </View>

        <View className="flex-row items-center">
          <View className="w-8 h-8 bg-secondary rounded-xl items-center justify-center">
            <Zap size={16} color="white" fill="white" />
          </View>
          <View className="ml-2">
            <Text className="text-white/60 text-[10px] font-bold uppercase">Rank</Text>
            <Text className="text-white font-bold text-base">Top 5%</Text>
          </View>
        </View>
      </View>
    </View>
  );
};
