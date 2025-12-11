import type { ChatStreamRequest } from './types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

export interface StreamCallbacks {
  onStart?: (conversationId: string) => void;
  onContent?: (text: string) => void;
  onComplete?: (conversationId: string) => void;
  onDone?: (conversationId: string) => void;
  onSummary?: (messageCount: number) => void;
  onError?: (error: Error) => void;
}

export async function streamChatResponse(
  request: ChatStreamRequest,
  callbacks: StreamCallbacks
): Promise<void> {
  const token = localStorage.getItem('authToken');
  
  if (!token) {
    callbacks.onError?.(new Error('No authentication token found'));
    return;
  }

  try {
    const response = await fetch(`${API_URL}/chat/stream`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const reader = response.body?.getReader();
    const decoder = new TextDecoder();

    if (!reader) {
      throw new Error('Response body is not readable');
    }

    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      
      // Keep the last incomplete line in the buffer
      buffer = lines.pop() || '';

      for (const line of lines) {
        if (line.trim() === '') continue;

        if (line.startsWith('event:')) {
          // Event type line - we'll use the data to determine the event
          continue;
        }

        if (line.startsWith('data:')) {
          try {
            const dataStr = line.substring(5).trim();
            const data = JSON.parse(dataStr);

            // Determine event type from previous line or infer from data
            if (data.conversation_id && data.type === undefined && data.text === undefined && data.message_count === undefined) {
              // This is likely a start, complete, or done event
              if (callbacks.onStart) {
                callbacks.onStart(data.conversation_id);
              }
            } else if (data.type === 'text_delta' && data.text) {
              callbacks.onContent?.(data.text);
            } else if (data.message_count !== undefined) {
              callbacks.onSummary?.(data.message_count);
            }
          } catch (e) {
            console.error('Error parsing SSE data:', e);
          }
        }
      }
    }
  } catch (error) {
    callbacks.onError?.(error as Error);
  }
}
