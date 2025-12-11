"use client";

import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, MessageSquare, Bot, User } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useGetConversationDetailsQuery } from "@/store/api/chatApi";
import { useGetUserProfileQuery } from "@/store/api/userApi";
import { streamChatResponse } from "@/lib/chat-stream";
import type { Message } from "@/lib/types";

interface ChatAreaProps {
  chatId: string | null;
  onConversationCreated?: (conversationId: string) => void;
}

export function ChatArea({ chatId, onConversationCreated }: ChatAreaProps) {
  const [inputValue, setInputValue] = useState("");
  const [newMessages, setNewMessages] = useState<Record<string, Message[]>>({});
  const [streamingContent, setStreamingContent] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const streamingContentRef = useRef<string>("");

  // Fetch user profile to get user_id
  const { data: userProfile } = useGetUserProfileQuery();

  // Fetch conversation details when chatId is available
  const { data: conversationData, isLoading, error, refetch } = useGetConversationDetailsQuery(
    { conversation_id: chatId!, include_messages: true, limit: 25 },
    { skip: !chatId }
  );

  // Get messages for current chat
  const currentChatKey = chatId || 'new';
  const currentNewMessages = newMessages[currentChatKey] || [];
  
  // Combine fetched messages with new messages
  const allMessages = [
    ...(conversationData?.data?.messages || []),
    ...currentNewMessages,
  ];

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [allMessages.length, streamingContent]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() && !isStreaming) {
      const userMessage = inputValue.trim();
      // Get user_id from profile or localStorage fallback
      const userId = userProfile?.data?.user_id || localStorage.getItem('userId') || 'default-user';
      
      // Add user message to new messages for this chat
      const newUserMessage: Message = {
        role: 'user',
        content: userMessage,
        metadata: {},
        created_at: new Date().toISOString(),
      };
      
      setNewMessages(prev => ({
        ...prev,
        [currentChatKey]: [...(prev[currentChatKey] || []), newUserMessage],
      }));
      setInputValue("");
      setIsStreaming(true);
      setStreamingContent("");
      streamingContentRef.current = "";

      let newConversationId = chatId;

      try {
        await streamChatResponse(
          {
            messages: [
              {
                role: 'user',
                content: userMessage,
              },
            ],
            stream: true,
            user_id: userId,
            ...(chatId && { conversation_id: chatId }),
          },
          {
            onStart: (conversationId) => {
              console.log('Stream started:', conversationId);
              if (!chatId) {
                newConversationId = conversationId;
                onConversationCreated?.(conversationId);
              }
            },
            onContent: (text) => {
              streamingContentRef.current += text;
              setStreamingContent(prev => prev + text);
            },
            onComplete: (conversationId) => {
              console.log('Stream complete:', conversationId);
            },
            onDone: () => {
              console.log('Stream done');
              
              // Use ref to get the complete streaming content
              const finalContent = streamingContentRef.current;
              
              // Add the complete assistant message to new messages
              if (finalContent) {
                setNewMessages(prev => ({
                  ...prev,
                  [newConversationId || 'new']: [...(prev[newConversationId || 'new'] || []), {
                    role: 'assistant',
                    content: finalContent,
                    metadata: {},
                    created_at: new Date().toISOString(),
                  }],
                }));
              }
              
              setStreamingContent("");
              streamingContentRef.current = "";
              setIsStreaming(false);
              
              // Refetch conversation to get updated data, then clear local messages
              if (newConversationId) {
                setTimeout(() => {
                  refetch().then(() => {
                    // Clear the new messages for this conversation after refetch
                    // since they're now in the fetched data
                    setNewMessages(prev => {
                      const updated = { ...prev };
                      if (newConversationId) {
                        delete updated[newConversationId];
                      }
                      return updated;
                    });
                  });
                }, 500);
              }
            },
            onSummary: (messageCount) => {
              console.log('Message count:', messageCount);
            },
            onError: (error) => {
              console.error('Stream error:', error);
              setIsStreaming(false);
              setStreamingContent("");
              streamingContentRef.current = "";
            },
          }
        );
      } catch (error) {
        console.error('Failed to send message:', error);
        setIsStreaming(false);
        setStreamingContent("");
        streamingContentRef.current = "";
      }
    }
  };

  // Format timestamp
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString("en-US", { 
      hour: "numeric", 
      minute: "2-digit",
      hour12: true 
    });
  };

  return (
    <div className="flex flex-col flex-1 h-screen">
      {/* Header */}
      <div className="border-b p-4 flex items-center gap-2 bg-background">
        <SidebarTrigger />
        <div className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          <h1 className="text-lg font-semibold">
            {conversationData?.data?.title || (chatId ? "Chat" : "New Chat")}
          </h1>
        </div>
      </div>

      {/* Chat Messages Area */}
      <div className="flex-1 overflow-y-auto p-4">
        {!chatId ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <MessageSquare className="h-12 w-12 text-muted-foreground mb-4" />
            <h2 className="text-2xl font-semibold mb-2">Welcome to Personalise AI</h2>
            <p className="text-muted-foreground">
              Start a conversation by typing a message below
            </p>
          </div>
        ) : isLoading ? (
          <div className="max-w-3xl mx-auto space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className={`flex gap-3 ${i % 2 === 0 ? "justify-end" : ""}`}>
                  <div className="h-8 w-8 rounded-full bg-muted"></div>
                  <div className="flex-1 max-w-[70%]">
                    <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-muted rounded w-1/2"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <MessageSquare className="h-12 w-12 text-destructive mb-4" />
            <h2 className="text-xl font-semibold mb-2">Error loading conversation</h2>
            <p className="text-muted-foreground">
              Please try again later
            </p>
          </div>
        ) : (
          <div className="max-w-3xl mx-auto space-y-6 pb-4">
            {allMessages.length > 0 ? (
              <>
                {allMessages.map((message, index) => (
                  <div
                    key={`${message.created_at}-${index}`}
                    className={`flex gap-3 ${
                      message.role === "user" ? "justify-end" : ""
                    }`}
                  >
                    {message.role === "assistant" && (
                      <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center shrink-0">
                        <Bot className="h-5 w-5 text-primary-foreground" />
                      </div>
                    )}
                    
                    <div className={`flex flex-col gap-1 max-w-[70%] ${
                      message.role === "user" ? "items-end" : ""
                    }`}>
                      <div className={`rounded-2xl px-4 py-3 ${
                        message.role === "user" 
                          ? "bg-primary text-primary-foreground" 
                          : "bg-muted"
                      }`}>
                        <p className="text-sm whitespace-pre-wrap wrap-break-word">
                          {message.content}
                        </p>
                      </div>
                      <span className="text-xs text-muted-foreground px-2">
                        {formatTime(message.created_at)}
                      </span>
                    </div>

                    {message.role === "user" && (
                      <div className="h-8 w-8 rounded-full bg-linear-to-br from-blue-500 to-blue-600 flex items-center justify-center shrink-0">
                        <User className="h-5 w-5 text-white" />
                      </div>
                    )}
                  </div>
                ))}
                
                {/* Show streaming message or typing indicator */}
                {isStreaming && (
                  <div className="flex gap-3">
                    <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center shrink-0">
                      <Bot className="h-5 w-5 text-primary-foreground" />
                    </div>
                    <div className="flex flex-col gap-1 max-w-[70%]">
                      <div className="rounded-2xl px-4 py-3 bg-muted">
                        {streamingContent ? (
                          <p className="text-sm whitespace-pre-wrap wrap-break-word">
                            {streamingContent}
                            <span className="inline-block w-1 h-4 bg-foreground ml-1 animate-pulse" />
                          </p>
                        ) : (
                          <div className="flex items-center gap-1">
                            <div className="w-2 h-2 bg-foreground rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                            <div className="w-2 h-2 bg-foreground rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                            <div className="w-2 h-2 bg-foreground rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </>
            ) : (
              <div className="text-muted-foreground text-center py-8">
                No messages yet. Start the conversation!
              </div>
            )}
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="border-t p-4 bg-background">
        <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
          <div className="flex gap-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Type your message here..."
              className="flex-1"
            />
            <Button type="submit" size="icon" disabled={!inputValue.trim() || isStreaming}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2 text-center">
            Press Enter to send your message
          </p>
        </form>
      </div>
    </div>
  );
}
