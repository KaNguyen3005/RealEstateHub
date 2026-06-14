"use client";

import { useCallback, useEffect, useState } from "react";

import { PropertyApprovalTable } from "@/components/admin/property-approval-table";
import { EmptyState } from "@/components/common/empty-state";
import { LoadingSpinner } from "@/components/common/loading-spinner";
import { getPendingAdminProperties, moderateAdminProperty } from "@/lib/admin";
import { useAuthStore } from "@/store/authStore";
import type { Property } from "@/types/property";

export default function AdminPropertiesPage() {
  const accessToken = useAuthStore((state) => state.accessToken);
  const authStatus = useAuthStore((state) => state.status);
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loadProperties = useCallback(async () => {
    if (authStatus === "bootstrapping") {
      return;
    }

    if (!accessToken) {
      setErrorMessage("Please login again before moderating properties.");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const data = await getPendingAdminProperties(accessToken);
      setProperties(data.items);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Failed to load pending properties.");
    } finally {
      setIsLoading(false);
    }
  }, [accessToken, authStatus]);

  useEffect(() => {
    void loadProperties();
  }, [loadProperties]);

  const handleModerate = async (propertyId: string, action: "approve" | "reject" | "hide") => {
    if (!accessToken) return;

    await moderateAdminProperty(propertyId, action, accessToken);
    setProperties((current) => current.filter((property) => property._id !== propertyId));
  };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-semibold text-foreground">Pending properties</h2>
        <p className="mt-2 text-sm text-muted-foreground">Approve, reject, or hide seller submissions.</p>
      </div>

      {isLoading ? (
        <LoadingSpinner label="Loading pending properties..." />
      ) : errorMessage ? (
        <EmptyState title="Pending properties could not load" description={errorMessage} actionLabel="Try again" onAction={loadProperties} />
      ) : properties.length === 0 ? (
        <EmptyState title="No pending properties" description="All property submissions have been reviewed." />
      ) : (
        <PropertyApprovalTable properties={properties} onModerate={handleModerate} />
      )}
    </div>
  );
}
