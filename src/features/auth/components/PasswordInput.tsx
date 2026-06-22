import React, { useState } from "react";
import { TouchableOpacity } from "react-native";
import { Eye, EyeOff, Lock } from "lucide-react-native";
import { Input } from "@/components/ui/Input";

interface PasswordInputProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
}

export const PasswordInput = ({
  label = "Password",
  placeholder = "Enter your password",
  value,
  onChangeText,
  error
}: PasswordInputProps) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <Input
      label={label}
      placeholder={placeholder}
      value={value}
      onChangeText={onChangeText}
      error={error}
      secureTextEntry={!showPassword}
      icon={<Lock size={20} color="#94A3B8" />}
      rightIcon={
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          {showPassword ? (
            <EyeOff size={20} color="#94A3B8" />
          ) : (
            <Eye size={20} color="#94A3B8" />
          )}
        </TouchableOpacity>
      }
    />
  );
};
