import React, { useState, useEffect, useCallback } from "react";
import { View, TextInput, TouchableOpacity, Keyboard, ActivityIndicator, Platform, Text } from "react-native";
import { Plus, Mic, ArrowUp } from "lucide-react-native";
import * as ImagePicker from "expo-image-picker";
import { cn } from "@/utils/cn";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MessageAttachment } from "../types/chat";

interface ChatInputProps {
  onSend: (text: string, attachments: MessageAttachment[]) => void;
  isLoading: boolean;
}

/**
 * ChatInput Component
 * Refactored for production: Strictly typed, keyboard-aware, and ChatGPT-styled.
 */
export function ChatInput({ onSend, isLoading }: ChatInputProps) {
  const [text, setText] = useState("");
  const [attachments, setAttachments] = useState<MessageAttachment[]>([]);
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const showSubscription = Keyboard.addListener(showEvent, () => setKeyboardVisible(true));
    const hideSubscription = Keyboard.addListener(hideEvent, () => setKeyboardVisible(false));

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  const handleSend = useCallback(() => {
    if ((text.trim() || attachments.length > 0) && !isLoading) {
      onSend(text, attachments);
      setText("");
      setAttachments([]);
    }
  }, [text, attachments, isLoading, onSend]);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.7,
    });

    if (!result.canceled && result.assets?.[0]) {
      const newAttachment: MessageAttachment = {
        type: 'image',
        uri: result.assets[0].uri
      };
      setAttachments(prev => [...prev, newAttachment]);
    }
  };

  const isInputEmpty = !text.trim() && attachments.length === 0;

  return (
    <View
      style={{
        paddingBottom: isKeyboardVisible
          ? (Platform.OS === 'ios' ? 8 : 12)
          : Math.max(insets.bottom, 12)
      }}
      className="bg-white dark:bg-slate-950 px-4 pt-2 border-t border-slate-100 dark:border-slate-800"
    >
      <View className="flex-row items-end bg-slate-100 dark:bg-slate-900 rounded-[32px] px-2 py-2 border border-slate-200 dark:border-slate-800">
        <TouchableOpacity
          onPress={pickImage}
          className="w-10 h-10 items-center justify-center rounded-full bg-slate-200 dark:bg-slate-800 mb-0.5 ml-0.5"
        >
          <Plus size={20} color="#64748B" />
        </TouchableOpacity>

        <TextInput
          style={{ textAlignVertical: 'center' }}
          className="flex-1 text-slate-900 dark:text-white text-[16px] px-3 py-2.5 max-h-32"
          placeholder="Message TopperAI"
          placeholderTextColor="#94A3B8"
          multiline
          value={text}
          onChangeText={setText}
          editable={!isLoading}
          accessibilityLabel="Message input field"
        />

        <TouchableOpacity
          onPress={handleSend}
          disabled={isInputEmpty || isLoading}
          className={cn(
            "w-10 h-10 rounded-full items-center justify-center mb-0.5 mr-0.5",
            isInputEmpty ? "bg-transparent" : "bg-primary"
          )}
        >
          {isLoading ? (
            <ActivityIndicator color={isInputEmpty ? "#94A3B8" : "white"} size="small" />
          ) : isInputEmpty ? (
            <Mic size={20} color="#64748B" />
          ) : (
            <ArrowUp size={22} color="white" />
          )}
        </TouchableOpacity>
      </View>

      {!isKeyboardVisible && (
        <Text className="text-[10px] text-slate-400 text-center mt-2 font-medium">
          TopperAI can make mistakes. Check important info.
        </Text>
      )}
    </View>
  );
}
