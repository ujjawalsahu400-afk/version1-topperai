import React from "react";
import {
  View,
  TextInput,
  Text,
  TextInputProps,
} from "react-native";
import { cn } from "@/utils/cn";

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  containerClassName?: string;
}

export const Input = ({
  label,
  error,
  icon,
  containerClassName,
  className,
  ...props
}: InputProps) => {
  const [isFocused, setIsFocused] = React.useState(false);

  return (
    <View className={cn("w-full mb-4", containerClassName)}>
      {label && (
        <Text className="text-slate-700 dark:text-slate-300 font-semibold mb-2 ml-1 text-sm">
          {label}
        </Text>
      )}
      <View
        className={cn(
          "flex-row items-center bg-slate-50 dark:bg-slate-800/50 border h-14 px-4 rounded-2xl",
          isFocused ? "border-primary" : "border-slate-200 dark:border-slate-800",
          error && "border-error",
          className
        )}
      >
        {icon && <View className="mr-3">{icon}</View>}
        <TextInput
          className="flex-1 text-slate-900 dark:text-white text-base h-full"
          placeholderTextColor="#94A3B8"
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          autoCapitalize="none"
          {...props}
        />
      </View>
      {error && (
        <Text className="text-error text-xs mt-1 ml-1 font-medium">
          {error}
        </Text>
      )}
    </View>
  );
};
