import React from "react";
import { View, Image, Text } from "react-native";
import { cn } from "@/utils/cn";

interface AvatarProps {
  src?: string;
  fallback: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  className?: string;
}

export const Avatar = ({
  src,
  fallback,
  size = "md",
  className,
}: AvatarProps) => {
  const sizes = {
    xs: "w-8 h-8",
    sm: "w-10 h-10",
    md: "w-12 h-12",
    lg: "w-16 h-16",
    xl: "w-24 h-24",
  };

  const textSizes = {
    xs: "text-xs",
    sm: "text-sm",
    md: "text-base font-bold",
    lg: "text-xl font-bold",
    xl: "text-3xl font-bold",
  };

  return (
    <View
      className={cn(
        "bg-primary/10 rounded-full items-center justify-center overflow-hidden border-2 border-white dark:border-slate-800",
        sizes[size],
        className
      )}
    >
      {src ? (
        <Image source={{ uri: src }} className="w-full h-full" />
      ) : (
        <Text className={cn("text-primary", textSizes[size])}>
          {fallback.substring(0, 1).toUpperCase()}
        </Text>
      )}
    </View>
  );
};
