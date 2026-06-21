import React from "react";
import { View, Text } from "react-native";
import { cn } from "@/utils/cn";

interface BadgeProps {
  label: string;
  variant?: "primary" | "secondary" | "success" | "warning" | "error" | "outline";
  size?: "sm" | "md";
  className?: string;
}

export const Badge = ({
  label,
  variant = "primary",
  size = "sm",
  className,
}: BadgeProps) => {
  const variants = {
    primary: "bg-primary/10",
    secondary: "bg-secondary/10",
    success: "bg-success/10",
    warning: "bg-warning/10",
    error: "bg-error/10",
    outline: "bg-transparent border border-slate-200 dark:border-slate-700",
  };

  const textVariants = {
    primary: "text-primary",
    secondary: "text-secondary",
    success: "text-success",
    warning: "text-warning",
    error: "text-error",
    outline: "text-slate-500 dark:text-slate-400",
  };

  const sizes = {
    sm: "px-2 py-0.5 rounded-lg",
    md: "px-3 py-1 rounded-xl",
  };

  const textSizes = {
    sm: "text-[10px] font-bold uppercase tracking-wider",
    md: "text-xs font-bold uppercase tracking-wider",
  };

  return (
    <View className={cn("inline-flex self-start items-center justify-center", variants[variant], sizes[size], className)}>
      <Text className={cn(textVariants[variant], textSizes[size])}>
        {label}
      </Text>
    </View>
  );
};
