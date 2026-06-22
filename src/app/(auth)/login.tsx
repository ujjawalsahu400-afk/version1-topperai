import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Mail, CheckCircle2, Circle } from "lucide-react-native";
import { useSignIn, useSSO } from "@clerk/clerk-expo";
import * as Linking from "expo-linking";
import * as WebBrowser from "expo-web-browser";
import { AuthHeader } from "@/features/auth/components/AuthHeader";
import { Input } from "@/components/ui/Input";
import { PasswordInput } from "@/features/auth/components/PasswordInput";
import { SocialLoginButton } from "@/features/auth/components/SocialLoginButton";
import { AuthFooter } from "@/features/auth/components/AuthFooter";
import { Button } from "@/components/ui/Button";
import { validateEmail, validatePassword } from "@/utils/validation";
import { useAuthStore } from "@/store/authStore";
import { useWarmUpBrowser } from "@/hooks/useWarmUpBrowser";

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
  useWarmUpBrowser();
  const router = useRouter();
  const { isLoaded, signIn, setActive } = useSignIn();
  const { startSSOFlow } = useSSO();
  const { setLoading, isLoading, clearError } = useAuthStore();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const handleLogin = async () => {
    if (!isLoaded) return;

    setErrors({});
    const emailErr = validateEmail(email);
    const passErr = validatePassword(password);

    if (emailErr || passErr) {
      setErrors({ email: emailErr || undefined, password: passErr || undefined });
      return;
    }

    setLoading(true);
    try {
      const result = await signIn.create({
        identifier: email,
        password,
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        router.replace("/(app)/(tabs)");
      } else {
        console.log("Login status:", result.status);
      }
    } catch (err: any) {
      setErrors({ email: err.errors?.[0]?.message || "Login failed" });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
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
      console.error("Google Login Error:", err);
      Alert.alert("Login Failed", "Could not sign in with Google.");
    } finally {
      setLoading(false);
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
            title="Welcome Back"
            subtitle="Sign in to continue your learning journey"
          />

          <View className="space-y-4">
            <Input
              label="Email Address"
              placeholder="Enter your email"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                if (errors.email) setErrors({ ...errors, email: undefined });
                clearError();
              }}
              error={errors.email}
              icon={<Mail size={20} color="#94A3B8" />}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <View>
              <PasswordInput
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  if (errors.password) setErrors({ ...errors, password: undefined });
                  clearError();
                }}
                error={errors.password}
              />
              <TouchableOpacity
                onPress={() => router.push("/(auth)/forgot-password")}
                className="self-end -mt-2"
              >
                <Text className="text-primary font-semibold text-sm">
                  Forgot Password?
                </Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              onPress={() => setRememberMe(!rememberMe)}
              className="flex-row items-center mt-4"
              activeOpacity={0.7}
            >
              {rememberMe ? (
                <CheckCircle2 size={20} color="#208AEF" />
              ) : (
                <Circle size={20} color="#94A3B8" />
              )}
              <Text className="ml-2 text-slate-600 dark:text-slate-400 font-medium text-sm">
                Remember Me
              </Text>
            </TouchableOpacity>

            <Button
              title="Sign In"
              onPress={handleLogin}
              isLoading={isLoading && !email.includes("@google")} // simple check to separate loading states
              className="mt-6"
            />

            <View className="flex-row items-center my-8">
              <View className="flex-1 h-[1px] bg-slate-100 dark:bg-slate-800" />
              <Text className="mx-4 text-slate-400 font-medium text-sm uppercase tracking-widest">or</Text>
              <View className="flex-1 h-[1px] bg-slate-100 dark:bg-slate-800" />
            </View>

            <SocialLoginButton onPress={handleGoogleLogin} isLoading={isLoading && email === ""} />
          </View>

          <AuthFooter
            message="Don't have an account?"
            linkText="Create Account"
            href="/(auth)/signup"
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
