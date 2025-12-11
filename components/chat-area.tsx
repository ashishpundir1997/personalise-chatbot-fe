"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, MessageSquare, Bot, User } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useGetConversationDetailsQuery } from "@/store/api/chatApi";

interface ChatAreaProps {
  chatId: string | null;
}

export function ChatArea({ chatId }: ChatAreaProps) {
  const [inputValue, setInputValue] = useState("");

  // Fetch conversation details when chatId is available
  const { data: conversationData, isLoading, error } = useGetConversationDetailsQuery(
    { conversation_id: chatId!, include_messages: true, limit: 25 },
    { skip: !chatId }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      console.log("Message sent:", inputValue);
      // Handle message submission here
      setInputValue("");
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
            {conversationData?.data?.messages && conversationData.data.messages.length > 0 ? (
              conversationData.data.messages.map((message, index) => (
                <div
                  key={index}
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
              ))
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
            <Button type="submit" size="icon" disabled={!inputValue.trim()}>
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
