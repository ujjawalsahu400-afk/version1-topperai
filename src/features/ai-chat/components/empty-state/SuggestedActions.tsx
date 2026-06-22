import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Sparkles, BookOpen, LayoutGrid, Calculator, Calendar, ChevronRight } from 'lucide-react-native';
import { cn } from '@/utils/cn';

interface Suggestion {
  icon: any;
  label: string;
  description: string;
  color: string;
  bgColor: string;
}

const SUGGESTIONS: Suggestion[] = [
  {
    icon: Sparkles,
    label: "Explain a Topic",
    description: "Break down complex concepts simply",
    color: "#208AEF",
    bgColor: "bg-blue-50 dark:bg-blue-950/30"
  },
  {
    icon: BookOpen,
    label: "Generate Notes",
    description: "Create structured study materials",
    color: "#6366F1",
    bgColor: "bg-indigo-50 dark:bg-indigo-950/30"
  },
  {
    icon: LayoutGrid,
    label: "Create Quiz",
    description: "Test your knowledge with MCQs",
    color: "#F59E0B",
    bgColor: "bg-amber-50 dark:bg-amber-950/30"
  },
  {
    icon: Calculator,
    label: "Solve a Doubt",
    description: "Get step-by-step solutions",
    color: "#10B981",
    bgColor: "bg-emerald-50 dark:bg-emerald-950/30"
  },
  {
    icon: Calendar,
    label: "Make Study Plan",
    description: "Organize your learning schedule",
    color: "#EC4899",
    bgColor: "bg-pink-50 dark:bg-pink-950/30"
  },
];

interface SuggestedActionsProps {
  onSelect: (label: string) => void;
}

export function SuggestedActions({ onSelect }: SuggestedActionsProps) {
  return (
    <View className="w-full px-6 mt-8">
      <View className="flex-row flex-wrap justify-between">
        {SUGGESTIONS.map((item, idx) => (
          <TouchableOpacity
            key={idx}
            onPress={() => onSelect(item.label)}
            activeOpacity={0.7}
            className={cn(
              "w-[48%] mb-4 p-4 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm bg-white dark:bg-slate-900",
              "active:scale-95 transition-all"
            )}
          >
            <View className={cn("w-10 h-10 rounded-2xl items-center justify-center mb-3", item.bgColor)}>
              <item.icon size={20} color={item.color} />
            </View>
            <Text className="text-sm font-bold text-slate-900 dark:text-white mb-1">
              {item.label}
            </Text>
            <Text className="text-[11px] text-slate-500 dark:text-slate-400 leading-4">
              {item.description}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};
