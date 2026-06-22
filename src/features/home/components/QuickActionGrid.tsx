import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { MessageSquare, BookOpen, LayoutGrid, FileText, ChevronRight } from "lucide-react-native";
import { useRouter } from "expo-router";

const ACTIONS = [
  {
    id: 'ai',
    title: "AI Assistant",
    desc: "Ask anything",
    icon: <MessageSquare size={24} color="#208AEF" />,
    bg: "bg-blue-50 dark:bg-blue-900/20",
    route: "/(app)/(tabs)/chat"
  },
  {
    id: 'notes',
    title: "Generate Notes",
    desc: "From PDF/Text",
    icon: <BookOpen size={24} color="#6D28D9" />,
    bg: "bg-purple-50 dark:bg-purple-900/20",
    route: "/(app)/(tabs)/notes"
  },
  {
    id: 'quiz',
    title: "Create Quiz",
    desc: "Test yourself",
    icon: <LayoutGrid size={24} color="#F59E0B" />,
    bg: "bg-amber-50 dark:bg-amber-900/20",
    route: "/(app)/(tabs)/quiz"
  },
  {
    id: 'test',
    title: "Mock Test",
    desc: "Exam practice",
    icon: <FileText size={24} color="#10B981" />,
    bg: "bg-emerald-50 dark:bg-emerald-900/20",
    route: "/(app)/(tabs)/quiz" // Placeholder
  }
];

export const QuickActionGrid = () => {
  const router = useRouter();

  return (
    <View className="px-8 mt-10">
      <View className="flex-row justify-between items-center mb-6">
        <Text className="text-xl font-bold text-slate-900 dark:text-white">Quick Actions</Text>
        <TouchableOpacity className="flex-row items-center">
          <Text className="text-primary font-bold text-sm">View All</Text>
          <ChevronRight size={16} color="#208AEF" />
        </TouchableOpacity>
      </View>

      <View className="flex-row flex-wrap justify-between">
        {ACTIONS.map((action) => (
          <TouchableOpacity
            key={action.id}
            onPress={() => router.push(action.route as any)}
            className={`w-[48%] ${action.bg} p-5 rounded-[32px] mb-4 border border-white/50 dark:border-white/5`}
          >
            <View className="w-12 h-12 bg-white dark:bg-slate-800 rounded-2xl items-center justify-center shadow-sm mb-4">
              {action.icon}
            </View>
            <Text className="text-slate-900 dark:text-white font-bold text-base">{action.title}</Text>
            <Text className="text-slate-500 dark:text-slate-400 text-xs mt-1">{action.desc}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};
