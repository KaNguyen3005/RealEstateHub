"use client";

import { useEffect } from "react";

import { getFavorites } from "@/lib/favorites";
import { useAuthStore } from "@/store/authStore";
import { useFavoriteStore } from "@/store/favoriteStore";

export function FavoriteBootstrap() {
  const accessToken = useAuthStore((state) => state.accessToken);
  const authStatus = useAuthStore((state) => state.status);
  const setFavorites = useFavoriteStore((state) => state.setFavorites);

  useEffect(() => {
    let isMounted = true;

    const syncFavorites = async () => {
      if (authStatus === "guest") {
        setFavorites([]);
        return;
      }

      if (authStatus !== "authenticated" || !accessToken) {
        return;
      }

      try {
        const data = await getFavorites(accessToken);

        if (isMounted) {
          setFavorites(data.favoriteIds);
        }
      } catch {
        if (isMounted) {
          setFavorites([]);
        }
      }
    };

    void syncFavorites();

    return () => {
      isMounted = false;
    };
  }, [accessToken, authStatus, setFavorites]);

  return null;
}
