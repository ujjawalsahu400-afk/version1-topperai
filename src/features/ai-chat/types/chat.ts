/**
 * Strict Types for AI Chat Module
 * Optimized for OpenRouter streaming and Firestore persistence.
 */

export type MessageRole = 'user' | 'assistant' | 'system';
export type AttachmentType = 'image' | 'pdf' | 'voice';

export interface MessageAttachment {
  type: AttachmentType;
  uri: string;
  name?: string;
  mimeType?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'ai'; // Internal app role for UI distinction
  content: string;
  attachments?: MessageAttachment[];
  timestamp: number;
}

export interface ChatSession {
  id: string;
  userId: string;
  title: string;
  lastMessage: string;
  updatedAt: number;
  createdAt?: number;
  messages?: ChatMessage[];
}

export interface AIHistoryItem {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

/**
 * OpenRouter API specific types
 */
export interface OpenRouterResponse {
  choices: Array<{
    message: {
      content: string;
      role: string;
    };
  }>;
  error?: {
    message: string;
    code: number;
  };
}
