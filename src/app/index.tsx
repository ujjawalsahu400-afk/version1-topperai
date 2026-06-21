import React from "react";
import { View, Text, SafeAreaView } from "react-native";
import { Link } from "expo-router";
import { GraduationCap, ArrowRight, Sparkles } from "lucide-react-native";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

export default function WelcomeScreen() {
  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-slate-900">
      <View className="flex-1 px-8 justify-between py-12">
        {/* Brand Header */}
        <View className="items-center mt-10">
          <View className="relative">
            <View className="w-24 h-24 bg-primary rounded-[32px] items-center justify-center shadow-2xl shadow-primary/40 transform rotate-3">
              <GraduationCap size={48} color="white" strokeWidth={1.5} />
            </View>
            <View className="absolute -top-2 -right-2 bg-accent p-1.5 rounded-full border-4 border-white dark:border-slate-900">
              <Sparkles size={16} color="white" fill="white" />
            </View>
          </View>

          <View className="items-center mt-8">
            <Badge label="Beta Access" variant="primary" className="mb-4" />
            <Text className="text-5xl font-bold text-slate-900 dark:text-white tracking-tight text-center">
              Topper<Text className="text-primary">AI</Text>
            </Text>
            <Text className="text-slate-500 dark:text-slate-400 text-center mt-4 text-xl leading-7 px-2 font-medium">
              The only study companion you'll ever need.
            </Text>
          </View>
        </View>

        {/* Action Button */}
        <View className="w-full">
          <Link href="/design-system" asChild>
            <Button
              title="Get Started"
              size="lg"
              className="w-full shadow-2xl shadow-primary/30"
              icon={<ArrowRight size={20} color="white" />}
              iconPosition="right"
            />
          </Link>

          <View className="flex-row items-center justify-center mt-8 space-x-2">
            <View className="h-[1px] w-8 bg-slate-200 dark:bg-slate-800" />
            <Text className="text-slate-400 dark:text-slate-500 text-sm font-medium">
              Join 10k+ top scorers
            </Text>
            <View className="h-[1px] w-8 bg-slate-200 dark:bg-slate-800" />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
