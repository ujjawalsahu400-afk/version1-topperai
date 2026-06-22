import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import { GraduationCap } from 'lucide-react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  withDelay
} from 'react-native-reanimated';

/**
 * ThinkingState Component
 * Production optimized using Reanimated 3 for UI thread animations.
 * Provides a "GPT" feel during response generation.
 */
export function ThinkingState() {
  return (
    <View className="flex-row items-center px-6 py-4">
      <View className="w-8 h-8 bg-primary/10 rounded-lg items-center justify-center mr-3">
        <GraduationCap size={16} color="#208AEF" />
      </View>
      <View className="flex-row items-center bg-slate-50 dark:bg-slate-900 px-4 py-2 rounded-2xl border border-slate-100 dark:border-slate-800">
        <Text className="text-xs font-medium text-slate-500 dark:text-slate-400 mr-2">TopperAI is thinking</Text>
        <View className="flex-row items-center pt-1">
          <Dot delay={0} />
          <Dot delay={200} />
          <Dot delay={400} />
        </View>
      </View>
    </View>
  );
}

interface DotProps {
  delay: number;
}

function Dot({ delay }: DotProps) {
  const opacity = useSharedValue(0.3);
  const scale = useSharedValue(0.8);

  useEffect(() => {
    // Staggered pulsing animation handled strictly on UI thread
    opacity.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(1, { duration: 400 }),
          withTiming(0.3, { duration: 400 })
        ),
        -1
      )
    );
    scale.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(1.2, { duration: 400 }),
          withTiming(0.8, { duration: 400 })
        ),
        -1
      )
    );
  }, [delay, opacity, scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View
      style={animatedStyle}
      className="w-1.5 h-1.5 bg-primary rounded-full mx-0.5"
    />
  );
}
