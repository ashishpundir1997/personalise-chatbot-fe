"use client";

import { useState } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { MessageSquare, Plus, History, User as UserIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { LogoutButton } from "@/components/logout-button";
import { useGetUserProfileQuery } from "@/store";

interface ChatSidebarProps {
  currentChatId: string | null;
  onSelectChat: (chatId: string) => void;
}

export function ChatSidebar({ currentChatId, onSelectChat }: ChatSidebarProps) {
  const { data: userProfile, isLoading: isLoadingProfile } = useGetUserProfileQuery();
  
  // Mock chat history - you can replace this with actual data later
  const [chatHistory] = useState([
    { id: "1", title: "First conversation", date: "Today" },
    { id: "2", title: "Project discussion", date: "Yesterday" },
    { id: "3", title: "Code review", date: "2 days ago" },
  ]);

  return (
    <Sidebar>
      <SidebarHeader className="border-b p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Chats
          </h2>
          <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </SidebarHeader>

      <SidebarContent className="p-2">
        <div className="mb-2 px-2 py-1 text-xs text-muted-foreground flex items-center gap-2">
          <History className="h-3 w-3" />
          Chat History
        </div>
        <Separator className="mb-2" />
        <SidebarMenu>
          {chatHistory.map((chat) => (
            <SidebarMenuItem key={chat.id}>
              <SidebarMenuButton
                onClick={() => onSelectChat(chat.id)}
                isActive={currentChatId === chat.id}
                className="w-full"
              >
                <div className="flex flex-col items-start gap-1 w-full">
                  <span className="font-medium text-sm truncate w-full">
                    {chat.title}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {chat.date}
                  </span>
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="border-t p-4 space-y-3">
        {/* User Profile */}
        <div className="flex items-center gap-3 p-2 rounded-md bg-muted/50">
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
            <UserIcon className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            {isLoadingProfile ? (
              <div className="text-sm text-muted-foreground">Loading...</div>
            ) : userProfile?.data ? (
              <>
                <p className="text-sm font-medium truncate">{userProfile.data.name}</p>
                <p className="text-xs text-muted-foreground truncate">{userProfile.data.email}</p>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">User</p>
            )}
          </div>
        </div>
        
        {/* Logout Button */}
        <LogoutButton />
        
        <div className="text-xs text-muted-foreground text-center">
          <p>Personalise AI Chatbot</p>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
