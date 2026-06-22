import React, { useState } from "react";
import { View, Text, ScrollView, KeyboardAvoidingView, Platform, Alert, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Mail, User, Hash } from "lucide-react-native";
import { useSignUp, useSSO } from "@clerk/clerk-expo";
import * as Linking from "expo-linking";
import * as WebBrowser from "expo-web-browser";
import { AuthHeader } from "@/features/auth/components/AuthHeader";
import { Input } from "@/components/ui/Input";
import { PasswordInput } from "@/features/auth/components/PasswordInput";
import { SocialLoginButton } from "@/features/auth/components/SocialLoginButton";
import { AuthFooter } from "@/features/auth/components/AuthFooter";
import { Button } from "@/components/ui/Button";
import { validateEmail, validatePassword, validateConfirmPassword, validateUserId, validateName } from "@/utils/validation";
import { useAuthStore } from "@/store/authStore";
import { useWarmUpBrowser } from "@/hooks/useWarmUpBrowser";

WebBrowser.maybeCompleteAuthSession();

export default function SignupScreen() {
  useWarmUpBrowser();
  const router = useRouter();
  const { isLoaded, signUp, setActive } = useSignUp();
  const { startSSOFlow } = useSSO();
  const { setPendingProfile, setLoading, isLoading } = useAuthStore();

  const [formData, setFormData] = useState({
    name: "",
    userId: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSignup = async () => {
    if (!isLoaded) return;

    const newErrors: Record<string, string> = {};

    const nameErr = validateName(formData.name);
    const idErr = validateUserId(formData.userId);
    const emailErr = validateEmail(formData.email);
    const passErr = validatePassword(formData.password);
    const confErr = validateConfirmPassword(formData.password, formData.confirmPassword);

    if (nameErr) newErrors.name = nameErr;
    if (idErr) newErrors.userId = idErr;
    if (emailErr) newErrors.email = emailErr;
    if (passErr) newErrors.password = passErr;
    if (confErr) newErrors.confirmPassword = confErr;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      await signUp.create({
        emailAddress: formData.email,
        password: formData.password,
      });

      setPendingProfile({
        name: formData.name,
        userId: formData.userId,
        email: formData.email,
      });

      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });

      setLoading(false);
      router.push("/(auth)/verify-email");
    } catch (err: any) {
      setLoading(false);
      Alert.alert("Signup Error", err.errors?.[0]?.message || "An error occurred during signup");
    }
  };

  const handleGoogleSignup = async () => {
    try {
      setLoading(true);
      const { createdSessionId, setActive: setSSOActive } = await startSSOFlow({
        strategy: "oauth_google",
        redirectUrl: Linking.createURL("/(app)/home", { scheme: "topperai" }),
      });

      if (createdSessionId && setSSOActive) {
        await setSSOActive({ session: createdSessionId });
        router.replace("/(app)/(tabs)");
      }
    } catch (err: any) {
      console.error("Google SSO Error:", err);
      Alert.alert("Signup Failed", "Could not create account with Google.");
    } finally {
      setLoading(false);
    }
  };

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-slate-900">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          className="px-8"
          showsVerticalScrollIndicator={false}
        >
          <AuthHeader
            title="Create Account"
            subtitle="Start your journey to becoming a topper"
          />

          <View className="space-y-4">
            <Input
              label="Full Name"
              placeholder="Enter your full name"
              value={formData.name}
              onChangeText={(v) => updateField("name", v)}
              error={errors.name}
              icon={<User size={20} color="#94A3B8" />}
            />

            <Input
              label="Unique User ID"
              placeholder="e.g. topper_alex"
              value={formData.userId}
              onChangeText={(v) => updateField("userId", v)}
              error={errors.userId}
              icon={<Hash size={20} color="#94A3B8" />}
              autoCapitalize="none"
            />

            <Input
              label="Email Address"
              placeholder="Enter your email"
              value={formData.email}
              onChangeText={(v) => updateField("email", v)}
              error={errors.email}
              icon={<Mail size={20} color="#94A3B8" />}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <PasswordInput
              value={formData.password}
              onChangeText={(v) => updateField("password", v)}
              error={errors.password}
            />

            <PasswordInput
              label="Confirm Password"
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChangeText={(v) => updateField("confirmPassword", v)}
              error={errors.confirmPassword}
            />

            <Button
              title="Create Account"
              onPress={handleSignup}
              isLoading={isLoading && !formData.email.includes("@google")}
              className="mt-6"
            />

            <View className="flex-row items-center my-8">
              <View className="flex-1 h-[1px] bg-slate-100 dark:bg-slate-800" />
              <Text className="mx-4 text-slate-400 font-medium text-sm uppercase tracking-widest">or</Text>
              <View className="flex-1 h-[1px] bg-slate-100 dark:bg-slate-800" />
            </View>

            <SocialLoginButton onPress={handleGoogleSignup} isLoading={isLoading && formData.email === ""} />
          </View>

          <AuthFooter
            message="Already have an account?"
            linkText="Sign In"
            href="/(auth)/login"
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
