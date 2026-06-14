import { apiClient } from "@/lib/api";
import type { ChatConversation, ChatConversationListResult, ChatMessage } from "@/types/chat";

export async function createConversation(propertyId: string, token: string) {
  const response = await apiClient.post<{ item: ChatConversation; created: boolean }>(
    "/api/conversations",
    { propertyId },
    { token }
  );

  return response.data ?? null;
}

export async function getConversations(token: string) {
  const response = await apiClient.get<ChatConversationListResult>("/api/conversations?limit=50", {
    token,
  });

  return response.data ?? {
    items: [],
    page: 1,
    limit: 50,
    totalItems: 0,
    totalPages: 1,
  };
}

export async function getConversationMessages(conversationId: string, token: string) {
  const response = await apiClient.get<{ items: ChatMessage[] }>(`/api/conversations/${conversationId}/messages`, {
    token,
  });

  return response.data?.items ?? [];
}
