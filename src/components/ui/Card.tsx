import React from "react";
import { View, ViewProps } from "react-native";
import { cn } from "@/utils/cn";

interface CardProps extends ViewProps {
  children: React.ReactNode;
  variant?: "default" | "elevated" | "outline";
  className?: string;
}

export const Card = ({
  children,
  variant = "default",
  className,
  ...props
}: CardProps) => {
  const variants = {
    default: "bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark",
    elevated: "bg-white dark:bg-surface-dark shadow-sm shadow-slate-200 dark:shadow-none border border-border-light dark:border-border-dark",
    outline: "bg-transparent border-2 border-slate-100 dark:border-slate-800",
  };

  return (
    <View
      className={cn(
        "rounded-3xl p-5",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </View>
  );
};
