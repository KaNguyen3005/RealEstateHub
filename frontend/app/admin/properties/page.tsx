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
      setErrorMessage("Vui lòng đăng nhập lại trước khi thực hiện kiểm duyệt bất động sản.");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const data = await getPendingAdminProperties(accessToken);
      setProperties(data.items);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Không thể tải danh sách bất động sản đang chờ.");
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
        <h2 className="text-2xl font-semibold text-foreground">Bất động sản chờ duyệt</h2>
        <p className="mt-2 text-sm text-muted-foreground">Phê duyệt, từ chối hoặc ẩn các tin đăng do người bán gửi lên.</p>
      </div>

      {isLoading ? (
        <LoadingSpinner label="Đang tải danh sách bất động sản chờ duyệt..." />
      ) : errorMessage ? (
        <EmptyState title="Không thể tải danh sách chờ duyệt" description={errorMessage} actionLabel="Thử lại" onAction={loadProperties} />
      ) : properties.length === 0 ? (
        <EmptyState title="Không có bất động sản nào đang chờ" description="Tất cả các tin đăng gửi lên đều đã được kiểm duyệt xong." />
      ) : (
        <PropertyApprovalTable properties={properties} onModerate={handleModerate} />
      )}
    </div>
  );
}