import { apiClient } from "@/lib/api";
import type { AdminContactRequest, AdminListResult, AdminStats, UserStatus } from "@/types/admin";
import type { Property } from "@/types/property";
import type { User, UserRole } from "@/types/user";

export async function getAdminStats(token: string) {
  const response = await apiClient.get<AdminStats>("/api/admin/stats", { token });

  return response.data ?? null;
}

export async function getAdminUsers(token: string) {
  const response = await apiClient.get<AdminListResult<User>>("/api/admin/users?limit=100", { token });

  return response.data ?? {
    items: [],
    page: 1,
    limit: 100,
    totalItems: 0,
    totalPages: 1,
  };
}

export async function updateAdminUserRole(userId: string, role: UserRole, token: string) {
  const response = await apiClient.patch<{ item: User }>(`/api/admin/users/${userId}/role`, { role }, { token });

  return response.data?.item ?? null;
}

export async function updateAdminUserStatus(userId: string, status: UserStatus, token: string) {
  const response = await apiClient.patch<{ item: User }>(`/api/admin/users/${userId}/status`, { status }, { token });

  return response.data?.item ?? null;
}

export async function getPendingAdminProperties(token: string) {
  const response = await apiClient.get<AdminListResult<Property>>("/api/admin/properties/pending?limit=100", { token });

  return response.data ?? {
    items: [],
    page: 1,
    limit: 100,
    totalItems: 0,
    totalPages: 1,
  };
}

export async function moderateAdminProperty(propertyId: string, action: "approve" | "reject" | "hide", token: string) {
  const response = await apiClient.patch<{ item: Property }>(`/api/admin/properties/${propertyId}/${action}`, {}, { token });

  return response.data?.item ?? null;
}

export async function getAdminContactRequests(token: string) {
  const response = await apiClient.get<AdminListResult<AdminContactRequest>>("/api/admin/contact-requests?limit=100", {
    token,
  });

  return response.data ?? {
    items: [],
    page: 1,
    limit: 100,
    totalItems: 0,
    totalPages: 1,
  };
}
