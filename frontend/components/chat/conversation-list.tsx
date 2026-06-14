"use client";

import { MessageSquare } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { ChatConversation, ChatParticipant, ChatProperty } from "@/types/chat";

interface ConversationListProps {
  conversations: ChatConversation[];
  selectedConversationId?: string;
  currentUserId: string;
  onSelect: (conversationId: string) => void;
}

function getPropertyTitle(conversation: ChatConversation) {
  return typeof conversation.propertyId === "string" ? "Property conversation" : conversation.propertyId.title;
}

function getOtherParticipant(conversation: ChatConversation, currentUserId: string): ChatParticipant | null {
  return conversation.participants.find((participant) => participant._id !== currentUserId) ?? null;
}

function getCoverImage(property: ChatConversation["propertyId"]) {
  if (typeof property === "string") {
    return null;
  }

  return (property as ChatProperty).images?.[0] ?? null;
}

export function ConversationList({ conversations, selectedConversationId, currentUserId, onSelect }: ConversationListProps) {
  if (conversations.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-border bg-muted/20 p-6 text-center">
        <MessageSquare className="mx-auto h-8 w-8 text-muted-foreground" />
        <p className="mt-3 text-sm font-medium text-foreground">No conversations yet</p>
        <p className="mt-1 text-sm text-muted-foreground">Start from a property detail page.</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {conversations.map((conversation) => {
        const otherParticipant = getOtherParticipant(conversation, currentUserId);
        const coverImage = getCoverImage(conversation.propertyId);
        const isSelected = conversation._id === selectedConversationId;

        return (
          <Button
            key={conversation._id}
            type="button"
            variant="ghost"
            className={cn(
              "h-auto w-full justify-start gap-3 rounded-lg border border-transparent p-3 text-left",
              isSelected && "border-primary/30 bg-primary/5"
            )}
            onClick={() => onSelect(conversation._id)}
          >
            <div className="h-12 w-12 overflow-hidden rounded-md bg-muted">
              {coverImage ? <img src={coverImage} alt="" className="h-full w-full object-cover" /> : null}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-foreground">{getPropertyTitle(conversation)}</p>
              <p className="truncate text-xs text-muted-foreground">{otherParticipant?.fullName ?? "Participant"}</p>
              <p className="mt-1 truncate text-xs text-muted-foreground">{conversation.lastMessage || "No messages yet"}</p>
            </div>
          </Button>
        );
      })}
    </div>
  );
}
