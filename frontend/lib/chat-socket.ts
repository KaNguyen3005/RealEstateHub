"use client";

import { io, type Socket } from "socket.io-client";

import { clientEnv } from "@/lib/env";
import type { ChatMessage } from "@/types/chat";

interface ServerToClientEvents {
  connected: (payload: { success: boolean; message: string }) => void;
  conversation_joined: (payload: { success: boolean; message: string; data?: { conversationId: string; room: string } }) => void;
  receive_message: (message: ChatMessage) => void;
  error: (payload: { success: false; message: string }) => void;
}

interface ClientToServerEvents {
  join_conversation: (
    payload: { conversationId: string },
    ack?: (payload: { success: boolean; message: string; data?: unknown }) => void
  ) => void;
  send_message: (
    payload: { conversationId: string; content: string },
    ack?: (payload: { success: boolean; message: string; data?: ChatMessage }) => void
  ) => void;
}

export type ChatSocket = Socket<ServerToClientEvents, ClientToServerEvents>;

export function createChatSocket(token: string): ChatSocket {
  const socketUrl = clientEnv.socketUrl || clientEnv.apiUrl;

  if (!socketUrl) {
    throw new Error("NEXT_PUBLIC_SOCKET_URL or NEXT_PUBLIC_API_URL is not configured.");
  }

  return io(socketUrl, {
    auth: {
      token,
    },
    transports: ["websocket"],
  });
}
