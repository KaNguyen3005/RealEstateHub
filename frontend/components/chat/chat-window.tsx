"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { Send } from "lucide-react";

import { LoadingSpinner } from "@/components/common/loading-spinner";
import { MessageBubble } from "@/components/chat/message-bubble";
import { Button } from "@/components/ui/button";
import { getConversationMessages } from "@/lib/chat";
import { createChatSocket, type ChatSocket } from "@/lib/chat-socket";
import type { ChatConversation, ChatMessage } from "@/types/chat";

interface ChatWindowProps {
  conversation: ChatConversation | null;
  accessToken: string;
  currentUserId: string;
  onMessageSent?: (conversationId: string, message: ChatMessage) => void;
}

function getConversationTitle(conversation: ChatConversation) {
  return typeof conversation.propertyId === "string" ? "Conversation" : conversation.propertyId.title;
}

export function ChatWindow({ conversation, accessToken, currentUserId, onMessageSent }: ChatWindowProps) {
  const socketRef = useRef<ChatSocket | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (!conversation) {
      setMessages([]);
      return;
    }

    let isMounted = true;
    const conversationId = conversation._id;

    async function loadMessages() {
      setIsLoading(true);
      setErrorMessage(null);

      try {
        const items = await getConversationMessages(conversationId, accessToken);
        if (isMounted) {
          setMessages(items);
        }
      } catch (error) {
        if (isMounted) {
          setErrorMessage(error instanceof Error ? error.message : "Failed to load messages.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    void loadMessages();

    return () => {
      isMounted = false;
    };
  }, [accessToken, conversation]);

  useEffect(() => {
    if (!conversation) {
      return undefined;
    }

    const socket = createChatSocket(accessToken);
    socketRef.current = socket;

    socket.on("receive_message", (message) => {
      if (String(message.conversationId) !== String(conversation._id)) {
        return;
      }

      setMessages((current) => {
        if (current.some((item) => item._id === message._id)) {
          return current;
        }

        return [...current, message];
      });
      onMessageSent?.(conversation._id, message);
    });

    socket.on("error", (payload) => {
      setErrorMessage(payload.message);
    });

    socket.emit("join_conversation", { conversationId: conversation._id }, (payload) => {
      if (!payload.success) {
        setErrorMessage(payload.message);
      }
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [accessToken, conversation, onMessageSent]);

  const handleSend = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const content = draft.trim();

    if (!conversation || !content || !socketRef.current) {
      return;
    }

    setIsSending(true);
    setErrorMessage(null);
    socketRef.current.emit("send_message", { conversationId: conversation._id, content }, (payload) => {
      setIsSending(false);

      if (!payload.success) {
        setErrorMessage(payload.message);
        return;
      }

      setDraft("");
    });
  };

  if (!conversation) {
    return (
      <div className="grid min-h-[520px] place-items-center rounded-lg border border-border/70 bg-background/90 p-6 text-center">
        <div>
          <p className="text-lg font-semibold text-foreground">Select a conversation</p>
          <p className="mt-2 text-sm text-muted-foreground">Choose a conversation from the list to start messaging.</p>
        </div>
      </div>
    );
  }

  return (
    <section className="flex min-h-[620px] flex-col rounded-lg border border-border/70 bg-background/90 shadow-sm">
      <header className="border-b border-border/70 p-4">
        <p className="text-sm font-semibold text-foreground">{getConversationTitle(conversation)}</p>
        <p className="mt-1 text-xs text-muted-foreground">Realtime messages are saved to this property conversation.</p>
      </header>

      <div className="flex-1 space-y-3 overflow-y-auto p-4">
        {isLoading ? (
          <LoadingSpinner label="Loading messages..." />
        ) : messages.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border bg-muted/20 p-5 text-center text-sm text-muted-foreground">
            No messages yet. Send the first one.
          </div>
        ) : (
          messages.map((message) => (
            <MessageBubble key={message._id} message={message} currentUserId={currentUserId} />
          ))
        )}
        <div ref={scrollRef} />
      </div>

      {errorMessage ? <p className="px-4 pb-2 text-sm text-destructive">{errorMessage}</p> : null}

      <form onSubmit={handleSend} className="flex gap-2 border-t border-border/70 p-4">
        <textarea
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          rows={2}
          placeholder="Write a message..."
          className="min-h-12 flex-1 resize-none rounded-md border border-input bg-background px-3 py-2 text-sm outline-none ring-offset-background placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        />
        <Button type="submit" disabled={isSending || draft.trim().length === 0}>
          <Send className="h-4 w-4" />
          {isSending ? "Sending..." : "Send"}
        </Button>
      </form>
    </section>
  );
}
