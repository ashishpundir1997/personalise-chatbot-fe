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

export interface PasswordResetRequestRequest {
  email: string;
}

export interface PasswordResetRequestResponse {
  status: boolean;
  message: string;
}

export interface PasswordResetRequest {
  email: string;
  otp: string;
  new_password: string;
}

export interface PasswordResetResponse {
  status: boolean;
  message: string;
}

/**
 * User Types
 */

export interface User {
  id?: string;
  name: string;
  email: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface UserProfileResponse {
  status: boolean;
  message: string;
  data: {
    name: string;
    email: string;
  };
}

/**
 * Chat Types
 */

export interface Chat {
  conversation_id: string;
  user_id: string;
  created_at: string;
  last_activity: string;
  message_count: number;
  title: string;
}

export interface ConversationsResponse {
  status: boolean;
  message: string;
  data: {
    conversations: Chat[];
    total?: number;
    limit: number;
    offset: number;
    next_offset?: number;
  };
}

export interface ConversationsRequest {
  limit?: number;
  offset?: number;
}

export interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
  metadata: Record<string, unknown>;
  created_at: string;
}

export interface ConversationDetailsRequest {
  conversation_id: string;
  include_messages?: boolean;
  limit?: number;
  cursor?: string | null;
}

export interface ConversationDetailsResponse {
  status: boolean;
  message: string;
  data: {
    conversation_id: string;
    user_id: string;
    created_at: string;
    last_activity: string;
    message_count: number;
    title: string;
    messages: Message[];
    returned_messages: number;
    has_more_messages: boolean;
    next_cursor: string | null;
  };
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
