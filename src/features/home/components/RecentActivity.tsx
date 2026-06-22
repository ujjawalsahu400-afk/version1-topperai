import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { ActivityItem } from "@/types/home";
import { BookOpen, LayoutGrid, FileText, ChevronRight } from "lucide-react-native";
import { EmptyState } from "@/components/ui/EmptyState";

interface RecentActivityProps {
  items: ActivityItem[];
}

export const RecentActivity = ({ items }: RecentActivityProps) => {
  if (items.length === 0) {
    return (
      <View className="px-8 mt-10">
        <Text className="text-xl font-bold text-slate-900 dark:text-white mb-6">Recent Activity</Text>
        <EmptyState
          title="No recent activity"
          description="Start learning to see your progress here."
        />
      </View>
    );
  }

  const getIcon = (type: ActivityItem['type']) => {
    switch (type) {
      case 'note': return <BookOpen size={18} color="#3B82F6" />;
      case 'quiz': return <LayoutGrid size={18} color="#F59E0B" />;
      case 'test': return <FileText size={18} color="#10B981" />;
    }
  };

  return (
    <View className="px-8 mt-10 mb-10">
      <Text className="text-xl font-bold text-slate-900 dark:text-white mb-6">Recent Activity</Text>
      <View className="space-y-3">
        {items.map((item) => (
          <TouchableOpacity
            key={item.id}
            className="flex-row items-center bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-50 dark:border-slate-800 shadow-sm"
          >
            <View className="w-10 h-10 bg-slate-50 dark:bg-slate-800 rounded-xl items-center justify-center">
              {getIcon(item.type)}
            </View>
            <View className="ml-4 flex-1">
              <Text className="text-slate-900 dark:text-white font-bold text-sm" numberOfLines={1}>
                {item.title}
              </Text>
              <View className="flex-row items-center mt-0.5">
                <Text className="text-slate-400 text-[10px] font-medium uppercase tracking-tight">
                  {item.type} • {item.timestamp}
                </Text>
                {item.status && (
                   <Text className="text-primary text-[10px] font-bold ml-2 uppercase">• {item.status}</Text>
                )}
              </View>
            </View>
            <ChevronRight size={16} color="#94A3B8" />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};
