import type { PropertyPurpose, PropertyStatus, PropertyType } from "@/types/property";
import type { User } from "@/types/user";

export interface ChatProperty {
  _id: string;
  title: string;
  price: number;
  status: PropertyStatus;
  purpose: PropertyPurpose;
  type: PropertyType;
  images: string[];
  ownerId?: string | Pick<User, "_id" | "fullName" | "email" | "role" | "avatar">;
}

export interface ChatParticipant extends Pick<User, "_id" | "fullName" | "email" | "role" | "avatar" | "status"> {}

export interface ChatConversation {
  _id: string;
  propertyId: ChatProperty | string;
  participants: ChatParticipant[];
  lastMessage: string;
  createdAt: string;
  updatedAt: string;
}

export interface ChatMessage {
  _id: string;
  conversationId: string;
  senderId: Pick<User, "_id" | "fullName"> | string;
  content: string;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ChatConversationListResult {
  items: ChatConversation[];
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
}
