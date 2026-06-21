import React from "react";
import { View, ActivityIndicator, Text } from "react-native";
import { cn } from "@/utils/cn";

interface LoaderProps {
  fullScreen?: boolean;
  message?: string;
  className?: string;
}

export const Loader = ({
  fullScreen = false,
  message,
  className,
}: LoaderProps) => {
  const containerStyle = fullScreen
    ? "flex-1 absolute inset-0 bg-white/80 dark:bg-slate-900/80 items-center justify-center z-50"
    : "items-center justify-center p-8";

  return (
    <View className={cn(containerStyle, className)}>
      <View className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-xl shadow-slate-200 dark:shadow-none items-center">
        <ActivityIndicator size="large" color="#208AEF" />
        {message && (
          <Text className="mt-4 text-slate-600 dark:text-slate-400 font-medium">
            {message}
          </Text>
        )}
      </View>
    </View>
  );
};

export const Skeleton = ({ className }: { className?: string }) => (
  <View className={cn("bg-slate-100 dark:bg-slate-800 animate-pulse rounded-xl", className)} />
);
