import { create } from 'zustand';
import { ChatMessage, ChatSession, MessageAttachment, AIHistoryItem } from '@/features/ai-chat/types/chat';
import { openRouterService } from '@/services/ai/openRouterService';
import { chatHistoryService } from '@/services/ai/chatHistoryService';

interface AIChatState {
  currentChatId: string | null;
  messages: ChatMessage[];
  chatHistory: ChatSession[];
  isLoading: boolean;
  isStreaming: boolean;
  error: string | null;

  // Actions
  addMessage: (message: ChatMessage) => void;
  sendMessage: (content: string, attachments: MessageAttachment[], userId?: string) => Promise<void>;
  loadHistory: (userId: string) => Promise<void>;
  loadChat: (chatId: string, userId: string) => Promise<void>;
  createNewChat: () => void;
  deleteChat: (chatId: string, userId: string) => Promise<void>;
  setLoading: (loading: boolean) => void;
  clearChat: () => void;
  clearError: () => void;
}

export const useAIChatStore = create<AIChatState>((set, get) => ({
  currentChatId: null,
  messages: [],
  chatHistory: [],
  isLoading: false,
  isStreaming: false,
  error: null,

  addMessage: (message: ChatMessage) => set((state) => ({
    messages: [...state.messages, message]
  })),

  setLoading: (loading: boolean) => set({ isLoading: loading }),

  loadHistory: async (userId: string) => {
    set({ isLoading: true });
    try {
      const history = await chatHistoryService.getUserChats(userId);
      set({ chatHistory: history });
    } catch (err) {
      console.error("History error:", err);
      set({ error: "Failed to load chat history" });
    } finally {
      set({ isLoading: false });
    }
  },

  loadChat: async (chatId: string, userId: string) => {
    set({ isLoading: true, currentChatId: chatId, messages: [] });
    try {
      const messages = await chatHistoryService.getChatMessages(chatId);
      set({ messages });
    } catch (err) {
      console.error("Load chat error:", err);
      set({ error: "Failed to load conversation" });
    } finally {
      set({ isLoading: false });
    }
  },

  createNewChat: () => {
    set({
      currentChatId: null,
      messages: [],
      error: null
    });
  },

  deleteChat: async (chatId: string, userId: string) => {
    try {
      await chatHistoryService.deleteChat(chatId);
      if (get().currentChatId === chatId) {
        get().createNewChat();
      }
      const updatedHistory = await chatHistoryService.getUserChats(userId);
      set({ chatHistory: updatedHistory });
    } catch (err) {
      console.error("Delete error:", err);
    }
  },

  sendMessage: async (content: string, attachments: MessageAttachment[], userId?: string) => {
    const { messages: prevMessages, currentChatId } = get();

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      role: 'user',
      content,
      attachments,
      timestamp: Date.now(),
    };

    // Update state immediately with user message and loading
    set((state) => ({
      messages: [...state.messages, userMsg],
      isLoading: true,
      error: null
    }));

    try {
      const currentMessages = get().messages;
      const history: AIHistoryItem[] = currentMessages.map(m => ({
        role: m.role === 'ai' ? 'assistant' : 'user',
        content: m.content
      }));

      let response: string;
      if (attachments && attachments.length > 0 && attachments[0].type === 'image') {
        response = await openRouterService.analyzeImage(attachments[0].uri, content);
      } else {
        set({ isStreaming: true });
        response = await openRouterService.sendMessage(content, history);
        set({ isStreaming: false });
      }

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        role: 'ai',
        content: response,
        timestamp: Date.now(),
      };

      set((state) => ({
        messages: [...state.messages, aiMsg],
        isLoading: false
      }));

      if (userId) {
        const finalMessages = get().messages;
        const savedChatId = await chatHistoryService.saveChat(userId, finalMessages, currentChatId || undefined);

        if (!currentChatId && savedChatId) {
          set({ currentChatId: savedChatId });
        }

        // Refresh history list silently
        chatHistoryService.getUserChats(userId).then(history => {
          set({ chatHistory: history });
        });
      }
    } catch (err: any) {
      console.error("Send message error:", err);
      set({
        error: err.message || "Something went wrong. Please try again.",
        isStreaming: false,
        isLoading: false
      });
    }
  },

  clearChat: () => set({ messages: [], currentChatId: null, error: null }),
  clearError: () => set({ error: null }),
}));
