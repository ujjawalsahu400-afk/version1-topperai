import React, { useState, useRef } from "react";
import { View, Text, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, Alert, TextInput, Keyboard } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Mail, CheckCircle2, Circle, ArrowRight, Lock } from "lucide-react-native";
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
import { cn } from "@/utils/cn";

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

  // Device Trust / MFA Step State
  const [verifyingDevice, setVerifyingDevice] = useState(false);
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const inputs = useRef<TextInput[]>([]);

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
      } else if (result.status === "needs_client_trust") {
        // Device is unrecognized, Clerk needs to "trust" it via email code
        await signIn.prepareFirstFactor({ strategy: "email_code" });
        setVerifyingDevice(true);
      } else {
        console.log("Login status:", result.status);
        Alert.alert("Login Incomplete", `Status: ${result.status}. Please contact support.`);
      }
    } catch (err: any) {
      setErrors({ email: err.errors?.[0]?.message || "Login failed" });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyDevice = async () => {
    if (!isLoaded) return;
    const verificationCode = code.join("");
    if (verificationCode.length < 6) return;

    setLoading(true);
    try {
      const result = await signIn.attemptFirstFactor({
        strategy: "email_code",
        code: verificationCode,
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        router.replace("/(app)/(tabs)");
      } else {
        Alert.alert("Verification Failed", "Please check the code and try again.");
      }
    } catch (err: any) {
      Alert.alert("Error", err.errors?.[0]?.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (value: string, index: number) => {
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    if (value && index < 5) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !code[index] && index > 0) {
      inputs.current[index - 1]?.focus();
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

  if (verifyingDevice) {
    return (
      <SafeAreaView className="flex-1 bg-white dark:bg-slate-900">
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="px-8">
          <AuthHeader
            title="Verify Device"
            subtitle="Enter the code sent to your email to trust this device"
            onBack={() => setVerifyingDevice(false)}
          />

          <View className="items-center py-6">
            <View className="w-20 h-20 bg-primary/10 rounded-full items-center justify-center mb-8">
              <Lock size={40} color="#208AEF" />
            </View>

            <Text className="text-slate-500 dark:text-slate-400 text-center text-base leading-6 px-6 mb-8">
              Clerk has detected a new device. Please enter the 6-digit verification code sent to your inbox.
            </Text>

            <View className="flex-row justify-between w-full mb-6">
              {code.map((digit, index) => (
                <TextInput
                  key={index}
                  ref={(el) => (inputs.current[index] = el!)}
                  className={cn(
                    "w-12 h-14 bg-slate-50 dark:bg-slate-800/50 border-2 rounded-xl text-center text-xl font-bold text-slate-900 dark:text-white",
                    digit ? "border-primary" : "border-slate-200 dark:border-slate-800"
                  )}
                  keyboardType="number-pad"
                  maxLength={1}
                  value={digit}
                  onChangeText={(value) => handleOtpChange(value, index)}
                  onKeyPress={(e) => handleKeyPress(e, index)}
                />
              ))}
            </View>

            <Button
              title="Verify & Sign In"
              onPress={handleVerifyDevice}
              isLoading={isLoading}
              className="w-full"
              icon={<ArrowRight size={20} color="white" />}
              iconPosition="right"
            />

            <TouchableOpacity
              onPress={async () => {
                await signIn?.prepareFirstFactor({ strategy: "email_code" });
                Alert.alert("Success", "Code resent.");
              }}
              className="mt-8"
            >
              <Text className="text-slate-500 dark:text-slate-400 font-medium">
                Didn't receive a code? <Text className="text-primary font-bold">Resend</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

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
