import React, { useState } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { Copy, RotateCcw, ThumbsUp, ThumbsDown, Share2, Check } from 'lucide-react-native';
import * as Clipboard from 'expo-clipboard';
import { cn } from '@/utils/cn';

interface MessageActionsProps {
  content: string;
  onRegenerate?: () => void;
}

export function MessageActions({ content, onRegenerate }: MessageActionsProps) {
  const [copied, setCopied] = useState(false);
  const [feedback, setFeedback] = useState<'up' | 'down' | null>(null);

  const handleCopy = async () => {
    await Clipboard.setStringAsync(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <View className="flex-row items-center mt-4 space-x-1">
      <ActionButton
        icon={copied ? Check : Copy}
        onPress={handleCopy}
        active={copied}
        activeColor="text-emerald-500"
      />
      {onRegenerate && (
        <ActionButton icon={RotateCcw} onPress={onRegenerate} />
      )}
      <ActionButton
        icon={ThumbsUp}
        onPress={() => setFeedback(feedback === 'up' ? null : 'up')}
        active={feedback === 'up'}
        activeColor="text-emerald-500"
      />
      <ActionButton
        icon={ThumbsDown}
        onPress={() => setFeedback(feedback === 'down' ? null : 'down')}
        active={feedback === 'down'}
        activeColor="text-rose-500"
      />
      <ActionButton icon={Share2} onPress={() => {}} />
    </View>
  );
};

const ActionButton = ({
  icon: Icon,
  onPress,
  active = false,
  activeColor = "text-primary"
}: {
  icon: any,
  onPress: () => void,
  active?: boolean,
  activeColor?: string
}) => (
  <TouchableOpacity
    onPress={onPress}
    className={cn(
      "p-2 rounded-lg items-center justify-center",
      active ? "bg-slate-100 dark:bg-slate-800" : "bg-transparent"
    )}
  >
    <Icon size={16} color={active ? (activeColor.includes('emerald') ? '#10B981' : activeColor.includes('rose') ? '#F43F5E' : '#208AEF') : '#94A3B8'} />
  </TouchableOpacity>
);
