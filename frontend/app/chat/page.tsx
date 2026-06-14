"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { ProtectedRoute } from "@/components/auth/protected-route";
import { EmptyState } from "@/components/common/empty-state";
import { LoadingSpinner } from "@/components/common/loading-spinner";
import { ChatWindow } from "@/components/chat/chat-window";
import { ConversationList } from "@/components/chat/conversation-list";
import { getConversations } from "@/lib/chat";
import { useAuthStore } from "@/store/authStore";
import type { ChatConversation, ChatMessage } from "@/types/chat";

export default function ChatPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const accessToken = useAuthStore((state) => state.accessToken);
  const user = useAuthStore((state) => state.user);
  const authStatus = useAuthStore((state) => state.status);
  const requestedConversationId = searchParams.get("conversationId") ?? "";
  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [selectedConversationId, setSelectedConversationId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (authStatus !== "authenticated" || !accessToken) {
      return;
    }

    let isMounted = true;
    const token = accessToken;

    async function loadConversations() {
      setIsLoading(true);
      setErrorMessage(null);

      try {
        const data = await getConversations(token);

        if (!isMounted) {
          return;
        }

        setConversations(data.items);

        const nextSelectedId =
          data.items.find((conversation) => conversation._id === requestedConversationId)?._id ??
          data.items[0]?._id ??
          "";
        setSelectedConversationId(nextSelectedId);
      } catch (error) {
        if (isMounted) {
          setErrorMessage(error instanceof Error ? error.message : "Không thể tải danh sách cuộc trò chuyện.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    void loadConversations();

    return () => {
      isMounted = false;
    };
  }, [accessToken, authStatus, requestedConversationId]);

  const selectedConversation = useMemo(
    () => conversations.find((conversation) => conversation._id === selectedConversationId) ?? null,
    [conversations, selectedConversationId]
  );

  const handleSelectConversation = (conversationId: string) => {
    setSelectedConversationId(conversationId);
    router.replace(`/chat?conversationId=${conversationId}`);
  };

  const handleMessageSent = useCallback((conversationId: string, message: ChatMessage) => {
    setConversations((current) =>
      current.map((conversation) =>
        conversation._id === conversationId
          ? {
              ...conversation,
              lastMessage: message.content,
              updatedAt: message.createdAt,
            }
          : conversation
      )
    );
  }, []);

  return (
    <ProtectedRoute>
      <section className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8 space-y-3">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary/80">Trực tuyến</p>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">Tin nhắn</h1>
          <p className="max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
            Tiếp tục các cuộc trò chuyện gắn liền với những bất động sản mà bạn đang quan tâm.
          </p>
        </div>

        {isLoading ? (
          <div className="rounded-lg border border-border/70 bg-background/90 p-6">
            <LoadingSpinner label="Đang tải hội thoại..." />
          </div>
        ) : errorMessage ? (
          <EmptyState title="Không thể tải mục tin nhắn" description={errorMessage} actionLabel="Khám phá nhà đất" actionHref="/properties" />
        ) : !accessToken || !user ? (
          <EmptyState title="Yêu cầu đăng nhập" description="Vui lòng đăng nhập tài khoản trước khi truy cập hộp thư." actionLabel="Đăng nhập" actionHref="/login" />
        ) : (
          <div className="grid gap-6 lg:grid-cols-[360px_minmax(0,1fr)]">
            <aside className="rounded-lg border border-border/70 bg-background/90 p-4 shadow-sm">
              <ConversationList
                conversations={conversations}
                selectedConversationId={selectedConversationId}
                currentUserId={user._id}
                onSelect={handleSelectConversation}
              />
            </aside>
            <ChatWindow
              conversation={selectedConversation}
              accessToken={accessToken}
              currentUserId={user._id}
              onMessageSent={handleMessageSent}
            />
          </div>
        )}
      </section>
    </ProtectedRoute>
  );
}