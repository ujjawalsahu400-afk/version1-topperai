import React, { useState } from "react";
import { View, Text, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Mail, CheckCircle } from "lucide-react-native";
import { AuthHeader } from "@/features/auth/components/AuthHeader";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { validateEmail } from "@/utils/validation";

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleReset = async () => {
    const err = validateEmail(email);
    if (err) {
      setError(err);
      return;
    }

    setIsLoading(true);
    // Mock API call
    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);
    }, 2000);
  };

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-slate-900">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="px-8">
        <AuthHeader
          title="Reset Password"
          subtitle="Don't worry, it happens. Enter your email to reset."
        />

        {!isSuccess ? (
          <View className="space-y-6">
            <Input
              label="Email Address"
              placeholder="Enter your registered email"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                setError(null);
              }}
              error={error || undefined}
              icon={<Mail size={20} color="#94A3B8" />}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <Button
              title="Send Reset Link"
              onPress={handleReset}
              isLoading={isLoading}
            />
          </View>
        ) : (
          <View className="items-center py-10">
            <View className="w-20 h-20 bg-success/10 rounded-full items-center justify-center mb-6">
              <CheckCircle size={40} color="#10B981" />
            </View>
            <Text className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
              Email Sent!
            </Text>
            <Text className="text-slate-500 dark:text-slate-400 text-center text-base leading-6 px-4">
              We've sent a password reset link to <Text className="font-bold text-slate-900 dark:text-white">{email}</Text>. Please check your inbox.
            </Text>

            <Button
              title="Back to Login"
              variant="outline"
              onPress={() => router.replace("/(auth)/login")}
              className="w-full mt-10"
            />

            <TouchableOpacity
              onPress={() => setIsSuccess(false)}
              className="mt-6"
            >
              <Text className="text-slate-500 font-medium">
                Didn't receive email? <Text className="text-primary font-bold">Try again</Text>
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
import { TouchableOpacity } from "react-native";
