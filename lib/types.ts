/**
 * API Response Types
 */

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

/**
 * Auth Types
 */

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface RegisterResponse {
  status: boolean;
  message: string;
  email?: string;
}

export interface VerifyEmailRequest {
  email: string;
  otp: string;
}

export interface VerifyEmailResponse {
  status: boolean;
  message: string;
  data?: {
    access_token: string;
    refresh_token: string;
    token_type: string;
    expires_in: number;
  };
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  status: boolean;
  message: string;
  data: {
    access_token: string;
    refresh_token: string;
    token_type: string;
    expires_in: number;
  };
}

/**
 * User Types
 */

export interface User {
  id: string;
  name: string;
  email: string;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Chat Types
 */

export interface Chat {
  id: string;
  title: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  messages?: Message[];
}

export interface Message {
  id: string;
  chatId: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  createdAt: string;
}

export interface CreateChatRequest {
  title?: string;
}

export interface SendMessageRequest {
  message: string;
}

export interface SendMessageResponse {
  message: Message;
  reply: Message;
}
