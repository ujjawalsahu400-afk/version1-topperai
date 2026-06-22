import React from "react";
import { View, Image, TouchableOpacity, ActivityIndicator } from "react-native";
import { Camera, User as UserIcon } from "lucide-react-native";
import { cn } from "@/utils/cn";

interface ProfileAvatarProps {
  uri?: string;
  size?: "sm" | "md" | "lg" | "xl";
  onPress?: () => void;
  isLoading?: boolean;
  isEditable?: boolean;
}

export const ProfileAvatar = ({
  uri,
  size = "md",
  onPress,
  isLoading,
  isEditable = false,
}: ProfileAvatarProps) => {
  const sizes = {
    sm: "w-10 h-10",
    md: "w-16 h-16",
    lg: "w-24 h-24",
    xl: "w-32 h-32",
  };

  const iconSizes = {
    sm: 16,
    md: 24,
    lg: 32,
    xl: 48,
  };

  return (
    <TouchableOpacity
      disabled={!onPress || isLoading}
      onPress={onPress}
      className={cn(
        "relative items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 border-4 border-white dark:border-slate-900 shadow-sm overflow-hidden",
        sizes[size]
      )}
    >
      {isLoading ? (
        <ActivityIndicator color="#208AEF" />
      ) : uri ? (
        <Image source={{ uri }} className="w-full h-full" />
      ) : (
        <UserIcon size={iconSizes[size]} color="#94A3B8" />
      )}

      {isEditable && !isLoading && (
        <View className="absolute bottom-0 w-full bg-black/40 py-1 items-center">
          <Camera size={12} color="white" />
        </View>
      )}
    </TouchableOpacity>
  );
};
