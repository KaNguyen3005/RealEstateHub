"use client";

import { useCallback, useEffect, useState } from "react";

import { ContactRequestTable } from "@/components/admin/contact-request-table";
import { EmptyState } from "@/components/common/empty-state";
import { LoadingSpinner } from "@/components/common/loading-spinner";
import { getAdminContactRequests } from "@/lib/admin";
import { useAuthStore } from "@/store/authStore";
import type { AdminContactRequest } from "@/types/admin";

export default function AdminContactRequestsPage() {
  const accessToken = useAuthStore((state) => state.accessToken);
  const authStatus = useAuthStore((state) => state.status);
  const [requests, setRequests] = useState<AdminContactRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loadRequests = useCallback(async () => {
    if (authStatus === "bootstrapping") {
      return;
    }

    if (!accessToken) {
      setErrorMessage("Please login again before viewing contact requests.");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const data = await getAdminContactRequests(accessToken);
      setRequests(data.items);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Failed to load contact requests.");
    } finally {
      setIsLoading(false);
    }
  }, [accessToken, authStatus]);

  useEffect(() => {
    void loadRequests();
  }, [loadRequests]);

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-semibold text-foreground">Contact requests</h2>
        <p className="mt-2 text-sm text-muted-foreground">Review requests submitted from property detail pages.</p>
      </div>

      {isLoading ? (
        <LoadingSpinner label="Loading contact requests..." />
      ) : errorMessage ? (
        <EmptyState title="Contact requests could not load" description={errorMessage} actionLabel="Try again" onAction={loadRequests} />
      ) : requests.length === 0 ? (
        <EmptyState title="No contact requests" description="No buyers have submitted contact forms yet." />
      ) : (
        <ContactRequestTable requests={requests} />
      )}
    </div>
  );
}
