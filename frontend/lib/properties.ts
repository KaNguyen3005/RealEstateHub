import { apiClient } from "@/lib/api";
import type { PropertyFormValues } from "@/lib/validations/property.schema";
import type { Property, PropertyListParams, PropertyListResult } from "@/types/property";

function appendParam(searchParams: URLSearchParams, key: string, value: unknown) {
  if (value === undefined || value === null || value === "") {
    return;
  }

  searchParams.set(key, String(value));
}

export function buildPropertyQuery(params: PropertyListParams = {}) {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => appendParam(searchParams, key, value));

  const query = searchParams.toString();
  return query ? `?${query}` : "";
}

export async function getProperties(params: PropertyListParams = {}, token?: string | null) {
  const response = await apiClient.get<PropertyListResult>(`/api/properties${buildPropertyQuery(params)}`, {
    token,
  });

  return response.data ?? {
    items: [],
    page: 1,
    limit: 10,
    totalItems: 0,
    totalPages: 1,
  };
}

export async function getPropertyById(id: string, token?: string | null) {
  const response = await apiClient.get<{ item: Property }>(`/api/properties/${id}`, {
    token,
  });

  return response.data?.item ?? null;
}

export async function getCompareProperties(ids: string[], token?: string | null) {
  if (ids.length === 0) {
    return [];
  }

  const response = await apiClient.get<{ items: Property[] }>(`/api/properties/compare?ids=${ids.join(",")}`, {
    token,
  });

  return response.data?.items ?? [];
}

export async function createProperty(payload: PropertyFormValues, token: string) {
  const response = await apiClient.post<{ item: Property }>("/api/properties", payload, {
    token,
  });

  return response.data?.item ?? null;
}

export async function updateProperty(id: string, payload: PropertyFormValues, token: string) {
  const response = await apiClient.put<{ item: Property }>(`/api/properties/${id}`, payload, {
    token,
  });

  return response.data?.item ?? null;
}

export async function deleteProperty(id: string, token: string) {
  const response = await apiClient.delete<{ item: Property }>(`/api/properties/${id}`, {
    token,
  });

  return response.data?.item ?? null;
}
