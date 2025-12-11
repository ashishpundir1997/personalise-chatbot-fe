"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, MessageSquare } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";

interface ChatAreaProps {
  chatId: string | null;
}

export function ChatArea({ chatId }: ChatAreaProps) {
  const [inputValue, setInputValue] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      console.log("Message sent:", inputValue);
      // Handle message submission here
      setInputValue("");
    }
  };

  return (
    <div className="flex flex-col flex-1 h-screen">
      {/* Header */}
      <div className="border-b p-4 flex items-center gap-2 bg-background">
        <SidebarTrigger />
        <div className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          <h1 className="text-lg font-semibold">
            {chatId ? `Chat ${chatId}` : "New Chat"}
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
        ) : (
          <div className="max-w-3xl mx-auto space-y-4">
            {/* Chat messages will appear here */}
            <div className="text-muted-foreground text-center py-8">
              Chat conversation will appear here...
            </div>
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
