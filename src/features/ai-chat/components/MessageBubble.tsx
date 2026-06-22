import React, { memo } from "react";
import { View, Text, Image } from "react-native";
import { ChatMessage } from "../types/chat";
import { MarkdownRenderer } from "./MarkdownRenderer";
import { GraduationCap } from "lucide-react-native";
import { MessageActions } from "./message-actions/MessageActions";

interface MessageBubbleProps {
  message: ChatMessage;
  onRegenerate?: () => void;
}

export const MessageBubble = memo(function MessageBubble({ message, onRegenerate }: MessageBubbleProps) {
  const isAi = message.role === "ai";

  if (!isAi) {
    return (
      <View className="flex-row justify-end mb-6 px-4">
        <View className="max-w-[85%] bg-primary rounded-[22px] rounded-tr-none px-4 py-3 shadow-sm">
          <Text className="text-white text-[15px] leading-6 font-medium">
            {message.content}
          </Text>
          {message.attachments && message.attachments.length > 0 && (
            <View className="mt-3 flex-row flex-wrap gap-2">
              {message.attachments.map((att, idx) => (
                <View key={idx} className="rounded-xl overflow-hidden border border-white/20">
                  {att.type === 'image' && (
                    <Image source={{ uri: att.uri }} style={{ width: 160, height: 120 }} resizeMode="cover" />
                  )}
                </View>
              ))}
            </View>
          )}
        </View>
      </View>
    );
  }

  return (
    <View className="flex-col mb-8 px-6">
      <View className="flex-row items-center mb-3">
        <View className="w-7 h-7 bg-primary rounded-lg items-center justify-center mr-2 shadow-sm">
          <GraduationCap size={14} color="white" />
        </View>
        <Text className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
          TopperAI
        </Text>
      </View>

      <View className="w-full">
        <MarkdownRenderer content={message.content} isAi={isAi} />

        <MessageActions
          content={message.content}
          onRegenerate={onRegenerate}
        />
      </View>
    </View>
  );
}, (prevProps, nextProps) => {
  // Only re-render if content changes (critical for streaming)
  return (
    prevProps.message.content === nextProps.message.content &&
    prevProps.message.id === nextProps.message.id
  );
});
