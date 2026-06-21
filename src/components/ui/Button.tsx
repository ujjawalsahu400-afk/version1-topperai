import React from "react";
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  View,
  TouchableOpacityProps,
} from "react-native";
import { cn } from "@/utils/cn";

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  className?: string;
}

export const Button = ({
  title,
  variant = "primary",
  size = "md",
  isLoading = false,
  icon,
  iconPosition = "left",
  className,
  disabled,
  ...props
}: ButtonProps) => {
  const variants = {
    primary: "bg-primary active:bg-primary/90",
    secondary: "bg-secondary active:bg-secondary/90",
    outline: "bg-transparent border border-primary active:bg-primary/10",
    ghost: "bg-transparent active:bg-slate-100 dark:active:bg-slate-800",
    danger: "bg-error active:bg-error/90",
  };

  const sizes = {
    sm: "px-4 py-2 rounded-xl",
    md: "px-6 py-4 rounded-2xl",
    lg: "px-8 py-5 rounded-3xl",
  };

  const textVariants = {
    primary: "text-white font-semibold",
    secondary: "text-white font-semibold",
    outline: "text-primary font-semibold",
    ghost: "text-slate-600 dark:text-slate-300 font-medium",
    danger: "text-white font-semibold",
  };

  const textSizes = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
  };

  return (
    <TouchableOpacity
      disabled={disabled || isLoading}
      className={cn(
        "flex-row items-center justify-center",
        variants[variant],
        sizes[size],
        (disabled || isLoading) && "opacity-50",
        className
      )}
      activeOpacity={0.7}
      {...props}
    >
      {isLoading ? (
        <ActivityIndicator
          color={variant === "outline" || variant === "ghost" ? "#208AEF" : "white"}
        />
      ) : (
        <View className="flex-row items-center justify-center">
          {icon && iconPosition === "left" && (
            <View className="mr-2">{icon}</View>
          )}
          <Text className={cn(textVariants[variant], textSizes[size])}>
            {title}
          </Text>
          {icon && iconPosition === "right" && (
            <View className="ml-2">{icon}</View>
          )}
        </View>
      )}
    </TouchableOpacity>
  );
};
