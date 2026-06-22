import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Animated } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LayoutGrid, Sparkles, CheckCircle2, XCircle, Trophy, ArrowRight } from 'lucide-react-native';
import { useQuizStore, QuizQuestion } from '@/store/quizStore';
import { useAuthStore } from '@/store/authStore';
import { useProfileStore } from '@/store/profileStore';
import { cn } from '@/utils/cn';

export default function QuizScreen() {
  const insets = useSafeAreaInsets();
  const { user } = useAuthStore();
  const { addXP, addCoins } = useProfileStore();
  const { currentQuestions, isGenerating, generateQuiz, saveQuizResult } = useQuizStore();

  const [topic, setTopic] = useState('Physics - Motion');
  const [currentIndex, setCurrentIndex] = useState(-1); // -1 = start screen, 0+ = questions, -2 = results
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [score, setScore] = useState(0);

  const startQuiz = async () => {
    await generateQuiz(topic, 'mcq', 'medium');
    setCurrentIndex(0);
    setScore(0);
  };

  const handleAnswer = (answer: string) => {
    if (selectedAnswer) return;
    setSelectedAnswer(answer);
    if (answer === currentQuestions[currentIndex].answer) {
      setScore(s => s + 1);
    }
  };

  const nextQuestion = () => {
    if (currentIndex < currentQuestions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedAnswer(null);
    } else {
      finishQuiz();
    }
  };

  const finishQuiz = () => {
    const finalScore = score;
    saveQuizResult(user?.id!, topic, currentQuestions, finalScore, 'medium');
    addXP(finalScore * 100, user?.id!);
    addCoins(finalScore * 10, user?.id!);
    setCurrentIndex(-2);
  };

  if (isGenerating) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#208AEF" />
        <Text className="mt-4 font-bold text-slate-400 uppercase tracking-widest text-xs">AI is drafting questions...</Text>
      </View>
    );
  }

  // Result Screen
  if (currentIndex === -2) {
    return (
      <View className="flex-1 bg-white items-center justify-center px-10">
        <View className="w-24 h-24 bg-amber-100 rounded-full items-center justify-center mb-6">
          <Trophy size={48} color="#F59E0B" />
        </View>
        <Text className="text-3xl font-bold text-slate-900 mb-2">Well Done!</Text>
        <Text className="text-slate-500 text-lg mb-8">You scored {score} out of {currentQuestions.length}</Text>

        <View className="w-full flex-row gap-4 mb-10">
          <View className="flex-1 bg-emerald-50 p-4 rounded-2xl items-center">
            <Text className="text-emerald-600 font-bold">+{score * 100} XP</Text>
          </View>
          <View className="flex-1 bg-amber-50 p-4 rounded-2xl items-center">
            <Text className="text-amber-600 font-bold">+{score * 10} Coins</Text>
          </View>
        </View>

        <TouchableOpacity
          onPress={() => setCurrentIndex(-1)}
          className="bg-primary w-full py-4 rounded-2xl items-center shadow-lg shadow-blue-200"
        >
          <Text className="text-white font-bold text-lg">Continue</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Question Screen
  if (currentIndex >= 0) {
    const q = currentQuestions[currentIndex];

    // Safety guard for missing questions
    if (!q) {
      return (
        <View className="flex-1 items-center justify-center bg-white px-10">
          <Text className="text-lg font-bold text-slate-900 text-center mb-6">Oops! We couldn't load the question.</Text>
          <TouchableOpacity
            onPress={() => setCurrentIndex(-1)}
            className="bg-primary w-full py-4 rounded-2xl items-center"
          >
            <Text className="text-white font-bold">Go Back</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <View className="flex-1 bg-white" style={{ paddingTop: insets.top }}>
        <View className="px-6 py-4 flex-row items-center justify-between border-b border-slate-50">
          <Text className="font-bold text-slate-400">Question {currentIndex + 1}/{currentQuestions.length}</Text>
          <View className="w-32 h-2 bg-slate-100 rounded-full overflow-hidden">
            <View
              style={{ width: `\${((currentIndex + 1) / currentQuestions.length) * 100}%` }}
              className="h-full bg-primary"
            />
          </View>
        </View>

        <ScrollView className="flex-1 px-6 pt-10">
          <Text className="text-2xl font-bold text-slate-900 mb-8 leading-9">{q.question}</Text>

          <View className="gap-4">
            {q.options?.map((opt, i) => {
              const isSelected = selectedAnswer === opt;
              const isCorrect = opt === q.answer;
              const showResult = selectedAnswer !== null;

              return (
                <TouchableOpacity
                  key={i}
                  onPress={() => handleAnswer(opt)}
                  disabled={showResult}
                  className={cn(
                    "p-5 rounded-2xl border-2 flex-row items-center justify-between",
                    showResult
                      ? (isCorrect ? "bg-emerald-50 border-emerald-500" : (isSelected ? "bg-rose-50 border-rose-500" : "bg-white border-slate-100"))
                      : "bg-white border-slate-100 active:border-primary"
                  )}
                >
                  <Text className={cn(
                    "text-lg font-semibold flex-1",
                    showResult && isCorrect ? "text-emerald-700" : "text-slate-700"
                  )}>
                    {opt}
                  </Text>
                  {showResult && isCorrect && <CheckCircle2 size={20} color="#10B981" />}
                  {showResult && isSelected && !isCorrect && <XCircle size={20} color="#EF4444" />}
                </TouchableOpacity>
              );
            })}
          </View>

          {selectedAnswer && (
            <View className="mt-8 p-6 bg-slate-50 rounded-3xl mb-20 border border-slate-100">
              <Text className="font-bold text-slate-900 mb-2">Explanation</Text>
              <Text className="text-slate-500 leading-6">{q.explanation}</Text>
              <TouchableOpacity
                onPress={nextQuestion}
                className="bg-slate-900 mt-6 py-4 rounded-2xl items-center flex-row justify-center"
              >
                <Text className="text-white font-bold mr-2">Next Question</Text>
                <ArrowRight size={18} color="white" />
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      </View>
    );
  }

  // Start Screen
  return (
    <View className="flex-1 bg-white" style={{ paddingTop: insets.top }}>
      <View className="px-6 py-4 border-b border-slate-50 flex-row items-center">
        <LayoutGrid size={24} color="#F59E0B" />
        <Text className="text-xl font-bold ml-3 text-slate-900">AI Quiz Battle</Text>
      </View>

      <View className="flex-1 px-6 justify-center items-center">
        <View className="w-20 h-20 bg-amber-50 rounded-3xl items-center justify-center mb-8 border border-amber-100 shadow-xl shadow-amber-50">
          <Sparkles size={40} color="#F59E0B" />
        </View>
        <Text className="text-3xl font-bold text-slate-900 text-center mb-4">Test Your Knowledge</Text>
        <Text className="text-slate-500 text-center px-6 leading-6 mb-12">
          Our AI will generate a set of challenging questions based on your level.
        </Text>

        <TouchableOpacity
          onPress={startQuiz}
          className="bg-slate-900 w-full py-5 rounded-[24px] items-center flex-row justify-center shadow-2xl"
        >
          <Sparkles size={20} color="white" />
          <Text className="text-white font-bold text-lg ml-3">Start AI Quiz</Text>
        </TouchableOpacity>

        <Text className="mt-4 text-slate-400 font-bold uppercase tracking-widest text-[10px]">Earn +500 XP per quiz</Text>
      </View>
    </View>
  );
}
