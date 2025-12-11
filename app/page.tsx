"use client";

import { useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { ChatSidebar } from "@/components/chat-sidebar";
import { ChatArea } from "@/components/chat-area";

export default function Home() {
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);

  const handleConversationCreated = (conversationId: string) => {
    console.log('New conversation created:', conversationId);
    setCurrentChatId(conversationId);
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <ChatSidebar 
          currentChatId={currentChatId}
          onSelectChat={setCurrentChatId}
        />
        <ChatArea 
          chatId={currentChatId} 
          onConversationCreated={handleConversationCreated}
        />
      </div>
    </SidebarProvider>
  );
}
