import React, { useRef, useEffect, useState, useCallback, useMemo } from "react";
import {
  View,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Text,
  TouchableOpacity,
  Keyboard,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MessageBubble } from "../components/MessageBubble";
import { ChatInput } from "../components/ChatInput";
import { ThinkingState } from "../components/thinking/ThinkingState";
import { SuggestedActions } from "../components/empty-state/SuggestedActions";
import { useAIChatStore } from "@/store/aiChatStore";
import { useAuthStore } from "@/store/authStore";
import { GraduationCap, Menu, Plus, ChevronDown } from "lucide-react-native";
import { useRouter, useNavigation } from "expo-router";
import Animated, {
  useSharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  interpolate,
  Extrapolation
} from "react-native-reanimated";
import { ChatMessage, MessageAttachment } from "../types/chat";

/**
 * AIChatScreen: The AI-First Home Experience
 * Redesigned for production stabilization and high performance.
 */
export default function AIChatScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const { user } = useAuthStore();
  const {
    messages,
    isLoading,
    isStreaming,
    sendMessage,
    error,
    createNewChat,
    currentChatId,
    chatHistory
  } = useAIChatStore();

  const flatListRef = useRef<FlatList<ChatMessage>>(null);
  const insets = useSafeAreaInsets();
  const [headerHeight, setHeaderHeight] = useState(0);

  // Reanimated 3 shared values for buttery-smooth header scaling
  const scrollY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const logoStyle = useAnimatedStyle(() => {
    const scale = interpolate(
      scrollY.value,
      [-50, 0],
      [1.2, 1],
      Extrapolation.CLAMP
    );
    return {
      transform: [{ scale }],
    };
  });

  const currentChat = useMemo(() =>
    chatHistory.find(c => c.id === currentChatId),
    [chatHistory, currentChatId]
  );

  const scrollToEnd = useCallback((animated = true) => {
    if (messages.length > 0) {
      requestAnimationFrame(() => {
        flatListRef.current?.scrollToEnd({ animated });
      });
    }
  }, [messages.length]);

  // Handle auto-scroll on new content or keyboard show
  useEffect(() => {
    scrollToEnd();
  }, [messages.length, isLoading, isStreaming, scrollToEnd]);

  useEffect(() => {
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const sub = Keyboard.addListener(showEvent, () => scrollToEnd());
    return () => sub.remove();
  }, [scrollToEnd]);

  const handleSend = useCallback(async (text: string, attachments: MessageAttachment[]) => {
    if (!user?.id) return;
    await sendMessage(text, attachments, user.id);
  }, [sendMessage, user?.id]);

  const renderItem = useCallback(({ item }: { item: ChatMessage }) => (
    <MessageBubble
      message={item}
      onRegenerate={() => handleSend(item.content, [])}
    />
  ), [handleSend]);

  const renderEmptyState = useCallback(() => (
    <View className="flex-1 items-center pt-20">
      <Animated.View
        style={[
          logoStyle,
          { width: 80, height: 80, borderRadius: 28 }
        ]}
        className="bg-primary items-center justify-center mb-6 shadow-2xl"
      >
        <GraduationCap size={40} color="white" />
      </Animated.View>

      <Text className="text-2xl font-bold text-slate-900 dark:text-white text-center px-10 mb-2 leading-8">
        How can I help you learn today?
      </Text>
      <Text className="text-slate-500 dark:text-slate-400 text-center px-12 mb-8 font-medium">
        Ask me anything about your studies, solve doubts, or generate notes.
      </Text>

      <SuggestedActions onSelect={(label) => handleSend(label, [])} />
    </View>
  ), [logoStyle, handleSend]);

  return (
    <View className="flex-1 bg-white dark:bg-slate-950">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
        keyboardVerticalOffset={Platform.OS === "ios" ? insets.top + headerHeight : 0}
      >
        <View style={{ paddingTop: insets.top }} className="flex-1 bg-white dark:bg-slate-950">
          {/* Production Header: Measures itself for precise keyboard offsets */}
          <View
            onLayout={(e) => setHeaderHeight(e.nativeEvent.layout.height)}
            className="flex-row items-center justify-between px-6 py-3 border-b border-slate-50 dark:border-slate-800"
          >
            <TouchableOpacity
              onPress={() => (navigation as any).openDrawer()}
              className="w-10 h-10 items-center justify-center -ml-2"
            >
              <Menu size={22} color="#64748B" />
            </TouchableOpacity>

            <View className="flex-1 items-center px-4">
              <TouchableOpacity
                activeOpacity={0.7}
                className="flex-row items-center bg-slate-50 dark:bg-slate-900 px-3 py-1.5 rounded-full border border-slate-100 dark:border-slate-800"
              >
                <Text className="text-sm font-bold text-slate-900 dark:text-white mr-1.5" numberOfLines={1}>
                  {currentChat?.title || "New Chat"}
                </Text>
                <ChevronDown size={14} color="#64748B" />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              onPress={createNewChat}
              className="w-10 h-10 items-center justify-center -mr-2"
            >
              <Plus size={22} color="#64748B" />
            </TouchableOpacity>
          </View>

          <Animated.FlatList
            ref={flatListRef as any}
            data={messages}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            contentContainerStyle={{
              paddingVertical: 20,
              flexGrow: 1,
            }}
            onScroll={scrollHandler}
            scrollEventThrottle={16}
            showsVerticalScrollIndicator={false}
            onContentSizeChange={() => scrollToEnd(true)}
            ListEmptyComponent={renderEmptyState}
            ListFooterComponent={
              <View className="pb-4">
                {(isLoading && !isStreaming) && <ThinkingState />}
                {error && (
                  <View className="px-8 py-3 mx-6 bg-rose-50 dark:bg-rose-950/20 rounded-2xl border border-rose-100 dark:border-rose-900/30">
                    <Text className="text-rose-600 dark:text-rose-400 text-xs font-bold uppercase tracking-widest text-center">
                      {error}
                    </Text>
                  </View>
                )}
              </View>
            }
          />

          <ChatInput onSend={handleSend} isLoading={isLoading || isStreaming} />
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}
