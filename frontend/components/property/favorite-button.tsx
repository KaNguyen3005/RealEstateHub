"use client";

import { useState } from "react";
import { Heart } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { addFavorite, removeFavorite } from "@/lib/favorites";
import { useAuthStore } from "@/store/authStore";
import { useFavoriteStore } from "@/store/favoriteStore";
import { cn } from "@/lib/utils";

interface FavoriteButtonProps {
  propertyId: string;
}

export function FavoriteButton({ propertyId }: FavoriteButtonProps) {
  const router = useRouter();
  const accessToken = useAuthStore((state) => state.accessToken);
  const authStatus = useAuthStore((state) => state.status);
  const favoriteIds = useFavoriteStore((state) => state.favoriteIds);
  const addFavoriteId = useFavoriteStore((state) => state.addFavorite);
  const removeFavoriteId = useFavoriteStore((state) => state.removeFavorite);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const isFavorite = favoriteIds.includes(propertyId);

  const handleFavorite = async () => {
    if (authStatus !== "authenticated" || !accessToken) {
      router.push(`/login?next=${encodeURIComponent(window.location.pathname)}`);
      return;
    }

    setIsSaving(true);
    setErrorMessage(null);

    try {
      if (isFavorite) {
        await removeFavorite(propertyId, accessToken);
        removeFavoriteId(propertyId);
      } else {
        await addFavorite(propertyId, accessToken);
        addFavoriteId(propertyId);
      }
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Failed to update favorite.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="relative">
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={isSaving || authStatus === "bootstrapping"}
        onClick={handleFavorite}
        className={cn(isFavorite && "border-red-200 bg-red-50 text-red-700 hover:text-red-700")}
      >
        <Heart className={cn("h-4 w-4", isFavorite && "fill-current")} />
        {isSaving ? "Saving" : isFavorite ? "Saved" : "Save"}
      </Button>
      {errorMessage ? (
        <p className="absolute right-0 top-full z-20 mt-2 w-56 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-800 shadow-sm">
          {errorMessage}
        </p>
      ) : null}
    </div>
  );
}
