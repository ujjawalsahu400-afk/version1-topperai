import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Calendar, Sparkles, ChevronRight, CheckCircle2, Clock } from 'lucide-react-native';
import { openRouterService } from '@/services/ai/openRouterService';
import { MarkdownRenderer } from '@/features/ai-chat/components/MarkdownRenderer';

export default function PlannerScreen() {
  const insets = useSafeAreaInsets();
  const [goal, setGoal] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [plan, setPlan] = useState<string | null>(null);

  const generatePlan = async () => {
    if (!goal.trim()) return;
    setIsGenerating(true);
    try {
      const prompt = `Create a detailed study plan for: \${goal}. Include daily breakdowns, estimated times, and focus areas.`;
      const system = "You are an expert academic counselor. Format the plan in clean Markdown with clear headings.";
      const res = await openRouterService.sendMessage(prompt, [{ role: 'system', content: system }]);
      setPlan(res);
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <View className="flex-1 bg-white" style={{ paddingTop: insets.top }}>
      <View className="px-6 py-4 border-b border-slate-50 flex-row items-center">
        <Calendar size={24} color="#EC4899" />
        <Text className="text-xl font-bold ml-3 text-slate-900">Study Planner</Text>
      </View>

      <ScrollView className="flex-1 px-6">
        {!plan ? (
          <View className="mt-8">
            <View className="p-8 bg-pink-50/50 rounded-[40px] items-center mb-8 border border-pink-100">
              <View className="w-16 h-16 bg-pink-500 rounded-2xl items-center justify-center mb-6 shadow-lg shadow-pink-200">
                <Sparkles size={32} color="white" />
              </View>
              <Text className="text-2xl font-bold text-slate-900 text-center mb-2">Smart Study Planner</Text>
              <Text className="text-slate-500 text-center font-medium leading-5">Tell us your goals and we'll create a personalized roadmap for you.</Text>
            </View>

            <Text className="font-bold text-slate-900 mb-4 px-2">What are you studying for?</Text>
            <TextInput
              className="bg-slate-50 p-6 rounded-3xl border border-slate-100 min-h-[120px] text-lg"
              placeholder="e.g. JEE Main preparation in 30 days, Final exams for Class 10..."
              multiline
              value={goal}
              onChangeText={setGoal}
            />

            <TouchableOpacity
              onPress={generatePlan}
              disabled={isGenerating}
              className="bg-[#EC4899] mt-8 py-5 rounded-[24px] items-center flex-row justify-center shadow-xl shadow-pink-200"
            >
              {isGenerating ? (
                <ActivityIndicator color="white" size="small" />
              ) : (
                <>
                  <Sparkles size={20} color="white" />
                  <Text className="text-white font-bold text-lg ml-3">Generate My Roadmap</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        ) : (
          <View className="mt-6">
            <MarkdownRenderer content={plan} isAi />
            <TouchableOpacity
              onPress={() => setPlan(null)}
              className="mt-10 mb-20 items-center"
            >
              <Text className="text-pink-500 font-bold">Create New Plan</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
