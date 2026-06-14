import type { Property } from "@/types/property";
import type { User, UserRole } from "@/types/user";

export type UserStatus = "active" | "blocked";
export type ContactRequestStatus = "new" | "contacted" | "closed";

export interface AdminStats {
  users: {
    total: number;
    active: number;
    blocked: number;
  };
  properties: {
    total: number;
    pending: number;
    approved: number;
  };
  contactRequests: {
    total: number;
    new: number;
  };
  conversations: {
    total: number;
  };
}

export interface AdminListResult<T> {
  items: T[];
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
}

export interface AdminContactRequest {
  _id: string;
  propertyId?: Pick<Property, "_id" | "title" | "price" | "status" | "city" | "district" | "ward"> | string;
  userId?: Pick<User, "_id" | "fullName" | "email" | "role" | "avatar" | "status"> | string;
  name: string;
  email: string;
  phone: string;
  message: string;
  status: ContactRequestStatus;
  createdAt: string;
  updatedAt: string;
}

export interface AdminUserUpdatePayload {
  role?: UserRole;
  status?: UserStatus;
}
