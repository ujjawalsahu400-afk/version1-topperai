import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Link } from "expo-router";

interface AuthFooterProps {
  message: string;
  linkText: string;
  href: any;
}

export const AuthFooter = ({ message, linkText, href }: AuthFooterProps) => {
  return (
    <View className="flex-row justify-center mt-10 pb-6">
      <Text className="text-slate-500 dark:text-slate-400 font-medium">
        {message}{" "}
      </Text>
      <Link href={href} asChild>
        <TouchableOpacity>
          <Text className="text-primary font-bold">{linkText}</Text>
        </TouchableOpacity>
      </Link>
    </View>
  );
};
