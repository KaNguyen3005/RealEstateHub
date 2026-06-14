"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MessageCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { createConversation } from "@/lib/chat";
import { useAuthStore } from "@/store/authStore";

interface StartChatButtonProps {
  propertyId: string;
  disabled?: boolean;
}

export function StartChatButton({ propertyId, disabled = false }: StartChatButtonProps) {
  const router = useRouter();
  const accessToken = useAuthStore((state) => state.accessToken);
  const authStatus = useAuthStore((state) => state.status);
  const [isStarting, setIsStarting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleStartChat = async () => {
    setErrorMessage(null);

    if (authStatus !== "authenticated" || !accessToken) {
      setErrorMessage("Please log in to start a chat.");
      return;
    }

    try {
      setIsStarting(true);
      const result = await createConversation(propertyId, accessToken);
      const conversationId = result?.item?._id;

      if (!conversationId) {
        throw new Error("Conversation could not be opened.");
      }

      router.push(`/chat?conversationId=${conversationId}`);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Failed to start chat.");
    } finally {
      setIsStarting(false);
    }
  };

  return (
    <div className="space-y-2">
      <Button type="button" disabled={disabled || isStarting} onClick={handleStartChat}>
        <MessageCircle className="h-4 w-4" />
        {isStarting ? "Opening..." : "Start chat"}
      </Button>
      {errorMessage ? <p className="text-sm text-destructive">{errorMessage}</p> : null}
    </div>
  );
}
