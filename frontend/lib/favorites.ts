import { apiClient } from "@/lib/api";
import type { Property } from "@/types/property";

export interface FavoriteListResult {
  items: Property[];
  favoriteIds: string[];
}

export async function getFavorites(token: string) {
  const response = await apiClient.get<FavoriteListResult>("/api/favorites", {
    token,
  });

  return response.data ?? {
    items: [],
    favoriteIds: [],
  };
}

export async function addFavorite(propertyId: string, token: string) {
  const response = await apiClient.post<{ item: Property }>(`/api/favorites/${propertyId}`, undefined, {
    token,
  });

  return response.data?.item ?? null;
}

export async function removeFavorite(propertyId: string, token: string) {
  const response = await apiClient.delete<{ removed: boolean; propertyId: string }>(`/api/favorites/${propertyId}`, {
    token,
  });

  return response.data ?? {
    removed: false,
    propertyId,
  };
}
