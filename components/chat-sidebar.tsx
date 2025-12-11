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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { MessageSquare, Plus, User as UserIcon, Trash2, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LogoutButton } from "@/components/logout-button";
import { useGetUserProfileQuery, useGetConversationsQuery, useDeleteConversationMutation } from "@/store";

interface ChatSidebarProps {
  currentChatId: string | null;
  onSelectChat: (chatId: string) => void;
  onNewChat: () => void;
}

export function ChatSidebar({ currentChatId, onSelectChat, onNewChat }: ChatSidebarProps) {
  const { data: userProfile, isLoading: isLoadingProfile } = useGetUserProfileQuery();
  const { data: conversations, isLoading: isLoadingChats } = useGetConversationsQuery({ limit: 20, offset: 0 });
  const [deleteConversation, { isLoading: isDeleting }] = useDeleteConversationMutation();
  const [deletePopoverOpen, setDeletePopoverOpen] = useState<string | null>(null);

  const handleDeleteClick = (e: React.MouseEvent, conversationId: string) => {
    e.stopPropagation();
    setDeletePopoverOpen(conversationId);
  };

  const handleDeleteConfirm = async (conversationId: string) => {
    try {
      await deleteConversation({ conversation_id: conversationId }).unwrap();
      
      // If the deleted chat was currently selected, switch to new chat
      if (currentChatId === conversationId) {
        onNewChat();
      }
      
      setDeletePopoverOpen(null);
    } catch (error) {
      console.error('Failed to delete conversation:', error);
      alert('Failed to delete conversation. Please try again.');
    }
  };

  const handleDeleteCancel = () => {
    setDeletePopoverOpen(null);
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInDays === 0) return "Today";
    if (diffInDays === 1) return "Yesterday";
    if (diffInDays < 7) return `${diffInDays}d ago`;
    
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  return (
    <Sidebar>
      <SidebarHeader className="border-b p-4 space-y-3">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          <h2 className="text-lg font-semibold">Chats</h2>
        </div>
        <Button size="sm" className="w-full" onClick={onNewChat}>
          <Plus className="h-4 w-4 mr-2" />
          New Chat
        </Button>
      </SidebarHeader>

      <SidebarContent className="p-2">
        {isLoadingChats ? (
          <div className="space-y-2 px-2 py-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse space-y-2 p-2 rounded-md bg-muted/50">
                <div className="h-4 bg-muted rounded w-3/4"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : conversations?.data?.conversations && conversations.data.conversations.length > 0 ? (
          <SidebarMenu>
            {conversations.data.conversations.map((chat) => (
              <SidebarMenuItem key={chat.conversation_id}>
                <div className="relative group/item">
                  <SidebarMenuButton
                    onClick={() => onSelectChat(chat.conversation_id)}
                    isActive={currentChatId === chat.conversation_id}
                    className="w-full h-auto py-3 px-3 pr-10"
                  >
                    <div className="flex items-start justify-between w-full gap-2">
                      <span className="font-medium text-sm truncate flex-1">
                        {chat.title}
                      </span>
                      <span className="text-xs text-muted-foreground whitespace-nowrap shrink-0">
                        {formatDate(chat.last_activity)}
                      </span>
                    </div>
                  </SidebarMenuButton>
                  
                  <Popover
                    open={deletePopoverOpen === chat.conversation_id}
                    onOpenChange={(open) => {
                      if (!open) {
                        setDeletePopoverOpen(null);
                      }
                    }}
                  >
                    <PopoverTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => handleDeleteClick(e, chat.conversation_id)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7 opacity-0 group-hover/item:opacity-100 transition-opacity hover:bg-destructive hover:text-destructive-foreground z-10"
                        disabled={isDeleting}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80" align="end">
                      <div className="space-y-3">
                        <div className="flex items-start gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-destructive/10">
                            <AlertTriangle className="h-5 w-5 text-destructive" />
                          </div>
                          <div className="flex-1 space-y-1">
                            <h4 className="text-sm font-semibold">Delete Conversation</h4>
                            <p className="text-sm text-muted-foreground">
                              Are you sure you want to delete this conversation? This action cannot be undone.
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2 justify-end">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={handleDeleteCancel}
                            disabled={isDeleting}
                          >
                            Cancel
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeleteConfirm(chat.conversation_id)}
                            disabled={isDeleting}
                          >
                            {isDeleting ? "Deleting..." : "Delete"}
                          </Button>
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        ) : (
          <div className="px-2 py-8 text-center space-y-2">
            <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground/30" />
            <p className="text-sm text-muted-foreground">No conversations yet</p>
            <p className="text-xs text-muted-foreground/70">Start a new chat to begin!</p>
          </div>
        )}
      </SidebarContent>

      <SidebarFooter className="border-t p-4 space-y-3">
        {/* User Profile */}
        <div className="flex items-center gap-3 p-3 rounded-lg bg-linear-to-r from-muted/50 to-muted/30 hover:from-muted hover:to-muted/50 transition-all">
          <div className="h-10 w-10 rounded-full bg-linear-to-br from-primary to-primary/60 flex items-center justify-center shadow-md">
            {isLoadingProfile ? (
              <div className="h-5 w-5 animate-pulse bg-primary-foreground/20 rounded-full"></div>
            ) : userProfile?.data ? (
              <span className="text-lg font-semibold text-primary-foreground">
                {userProfile.data.name.charAt(0).toUpperCase()}
              </span>
            ) : (
              <UserIcon className="h-5 w-5 text-primary-foreground" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            {isLoadingProfile ? (
              <div className="space-y-2">
                <div className="h-4 bg-muted rounded w-3/4 animate-pulse"></div>
                <div className="h-3 bg-muted rounded w-1/2 animate-pulse"></div>
              </div>
            ) : userProfile?.data ? (
              <>
                <p className="text-sm font-semibold truncate">{userProfile.data.name}</p>
                <p className="text-xs text-muted-foreground truncate">{userProfile.data.email}</p>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">User</p>
            )}
          </div>
        </div>
        
        {/* Logout Button */}
        <LogoutButton />
      </SidebarFooter>
    </Sidebar>
  );
}
