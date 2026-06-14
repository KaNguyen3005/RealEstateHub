"use client";

import { useCallback, useEffect, useState } from "react";

import { AdminStatsCards } from "@/components/admin/admin-stats-cards";
import { EmptyState } from "@/components/common/empty-state";
import { LoadingSpinner } from "@/components/common/loading-spinner";
import { getAdminStats } from "@/lib/admin";
import { useAuthStore } from "@/store/authStore";
import type { AdminStats } from "@/types/admin";

export default function AdminPage() {
  const accessToken = useAuthStore((state) => state.accessToken);
  const authStatus = useAuthStore((state) => state.status);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loadStats = useCallback(async () => {
    if (authStatus === "bootstrapping") {
      return;
    }

    if (!accessToken) {
      setErrorMessage("Please login again before viewing admin stats.");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      setStats(await getAdminStats(accessToken));
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Failed to load admin stats.");
    } finally {
      setIsLoading(false);
    }
  }, [accessToken, authStatus]);

  useEffect(() => {
    void loadStats();
  }, [loadStats]);

  if (isLoading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <LoadingSpinner label="Loading admin stats..." />
      </div>
    );
  }

  if (errorMessage || !stats) {
    return <EmptyState title="Admin stats could not load" description={errorMessage ?? "No stats available."} actionLabel="Try again" onAction={loadStats} />;
  }

  return <AdminStatsCards stats={stats} />;
}
