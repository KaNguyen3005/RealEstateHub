"use client";

import { useEffect, useState } from "react";

import { ProtectedRoute } from "@/components/auth/protected-route";
import { EmptyState } from "@/components/common/empty-state";
import { LoadingSpinner } from "@/components/common/loading-spinner";
import { PropertyCard } from "@/components/property/property-card";
import { getFavorites } from "@/lib/favorites";
import { useAuthStore } from "@/store/authStore";
import { useFavoriteStore } from "@/store/favoriteStore";
import type { Property } from "@/types/property";

export default function FavoritesPage() {
  const accessToken = useAuthStore((state) => state.accessToken);
  const authStatus = useAuthStore((state) => state.status);
  const setFavorites = useFavoriteStore((state) => state.setFavorites);
  const [items, setItems] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadFavorites = async () => {
      if (authStatus === "bootstrapping") {
        return;
      }

      if (!accessToken) {
        setItems([]);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setErrorMessage(null);

      try {
        const data = await getFavorites(accessToken);

        if (isMounted) {
          setItems(data.items);
          setFavorites(data.favoriteIds);
        }
      } catch (error) {
        if (isMounted) {
          setErrorMessage(error instanceof Error ? error.message : "Không thể tải danh sách yêu thích.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void loadFavorites();

    return () => {
      isMounted = false;
    };
  }, [accessToken, authStatus, setFavorites]);

  return (
    <ProtectedRoute>
      <section className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8 space-y-3">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary/80">Yêu thích</p>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">Danh sách đã lưu</h1>
          <p className="max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
            Các bất động sản bạn đã lưu vào tài khoản cá nhân.
          </p>
        </div>

        {isLoading ? (
          <div className="flex min-h-[40vh] items-center justify-center">
            <LoadingSpinner label="Đang tải danh sách yêu thích..." />
          </div>
        ) : errorMessage ? (
          <EmptyState title="Không thể tải danh sách yêu thích" description={errorMessage} actionLabel="Khám phá nhà đất" actionHref="/properties" />
        ) : items.length === 0 ? (
          <EmptyState title="Chưa có bất động sản nào được lưu" description={ "Hãy lưu các bất động sản từ trang danh sách để xem lại tại đây."} actionLabel="Khám phá nhà đất" actionHref="/properties" />
        ) : (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {items.map((property) => (
              <PropertyCard key={property._id} property={property} />
            ))}
          </div>
        )}
      </section>
    </ProtectedRoute>
  );
}