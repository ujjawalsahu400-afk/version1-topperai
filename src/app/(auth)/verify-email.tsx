import React, { useState, useRef } from "react";
import { View, Text, ScrollView, TouchableOpacity, TextInput, Keyboard, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Mail, ArrowRight } from "lucide-react-native";
import { useSignUp } from "@clerk/clerk-expo";
import { AuthHeader } from "@/features/auth/components/AuthHeader";
import { Button } from "@/components/ui/Button";
import { useAuthStore } from "@/store/authStore";
import { authService } from "@/services/auth/authService";
import { cn } from "@/utils/cn";

export default function VerifyEmailScreen() {
  const router = useRouter();
  const { isLoaded, signUp, setActive } = useSignUp();
  const { pendingProfile, setLoading, isLoading } = useAuthStore();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState<string | null>(null);
  const inputs = useRef<TextInput[]>([]);

  const handleOtpChange = (value: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError(null);

    // Move to next input if value is entered
    if (value && index < 5) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    // Move to previous input on backspace if current is empty
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    if (!isLoaded) return;

    const code = otp.join("");
    if (code.length < 6) {
      setError("Please enter the complete 6-digit code");
      return;
    }

    setLoading(true);
    Keyboard.dismiss();

    try {
      const result = await signUp.attemptEmailAddressVerification({
        code,
      });

      if (result.status === "complete") {
        // Create Firestore profile before setting session active
        if (pendingProfile) {
          await authService.handlePostSignup(result.createdUserId!, {
            ...pendingProfile,
            email: result.emailAddress
          });
        }

        await setActive({ session: result.createdSessionId });
        router.push("/(auth)/profile-setup");
      } else {
        setError("Verification incomplete. Please check your code.");
      }
    } catch (err: any) {
      setError(err.errors?.[0]?.message || "Invalid verification code");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!isLoaded) return;
    try {
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      Alert.alert("Success", "Verification code resent to your email.");
    } catch (err: any) {
      Alert.alert("Error", err.errors?.[0]?.message || "Failed to resend code");
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-slate-900">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="px-8">
        <AuthHeader
          title="Verify Email"
          subtitle="Enter the 6-digit code sent to your email"
        />

        <View className="items-center py-6">
          <View className="w-20 h-20 bg-primary/10 rounded-full items-center justify-center mb-8">
            <Mail size={40} color="#208AEF" />
          </View>

          <Text className="text-slate-500 dark:text-slate-400 text-center text-base leading-6 px-6 mb-8">
            We've sent a code to your email address.
          </Text>

          {/* OTP Input Grid */}
          <View className="flex-row justify-between w-full mb-6">
            {otp.map((digit, index) => (
              <TextInput
                key={index}
                ref={(el) => (inputs.current[index] = el!)}
                className={cn(
                  "w-12 h-14 bg-slate-50 dark:bg-slate-800/50 border-2 rounded-xl text-center text-xl font-bold text-slate-900 dark:text-white",
                  digit ? "border-primary" : "border-slate-200 dark:border-slate-800",
                  error && "border-error"
                )}
                keyboardType="number-pad"
                maxLength={1}
                value={digit}
                onChangeText={(value) => handleOtpChange(value, index)}
                onKeyPress={(e) => handleKeyPress(e, index)}
              />
            ))}
          </View>

          {error && (
            <Text className="text-error text-sm font-medium mb-6 text-center">
              {error}
            </Text>
          )}

          <Button
            title="Verify & Continue"
            onPress={handleVerify}
            isLoading={isLoading}
            className="w-full"
            icon={<ArrowRight size={20} color="white" />}
            iconPosition="right"
          />

          <TouchableOpacity onPress={handleResend} className="mt-8">
            <Text className="text-slate-500 dark:text-slate-400 font-medium">
              Didn't receive a code? <Text className="text-primary font-bold">Resend</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
