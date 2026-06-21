import React from "react";
import { View, Text } from "react-native";
import { LucideIcon } from "lucide-react-native";
import { cn } from "@/utils/cn";
import { Button } from "./Button";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionTitle?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyState = ({
  icon: Icon,
  title,
  description,
  actionTitle,
  onAction,
  className,
}: EmptyStateProps) => {
  return (
    <View className={cn("flex-1 items-center justify-center p-8", className)}>
      <View className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-full items-center justify-center mb-6">
        <Icon size={40} color="#94A3B8" strokeWidth={1.5} />
      </View>
      <Text className="text-xl font-bold text-slate-900 dark:text-white text-center mb-2">
        {title}
      </Text>
      <Text className="text-slate-500 dark:text-slate-400 text-center leading-5 mb-8 px-4">
        {description}
      </Text>
      {actionTitle && onAction && (
        <Button
          title={actionTitle}
          onPress={onAction}
          variant="outline"
          size="sm"
        />
      )}
    </View>
  );
};
