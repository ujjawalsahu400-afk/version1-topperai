import React from "react";
import { Globe } from "lucide-react-native";
import { Button } from "@/components/ui/Button";

interface SocialLoginButtonProps {
  onPress: () => void;
  isLoading?: boolean;
}

export const SocialLoginButton = ({ onPress, isLoading }: SocialLoginButtonProps) => {
  return (
    <Button
      title="Continue with Google"
      variant="outline"
      icon={<Globe size={20} color="#208AEF" />}
      onPress={onPress}
      isLoading={isLoading}
      className="border-slate-200 dark:border-slate-800"
    />
  );
};
