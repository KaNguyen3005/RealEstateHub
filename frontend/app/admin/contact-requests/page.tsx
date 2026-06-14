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
      setErrorMessage("Vui lòng đăng nhập lại để xem các yêu cầu liên hệ.");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const data = await getAdminContactRequests(accessToken);
      setRequests(data.items);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Không thể tải danh sách yêu cầu liên hệ.");
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
        <h2 className="text-2xl font-semibold text-foreground">Yêu cầu liên hệ</h2>
        <p className="mt-2 text-sm text-muted-foreground">Xem và kiểm tra các yêu cầu được gửi từ trang chi tiết bất động sản.</p>
      </div>

      {isLoading ? (
        <LoadingSpinner label="Đang tải danh sách yêu cầu..." />
      ) : errorMessage ? (
        <EmptyState title="Không thể tải danh sách yêu cầu liên hệ" description={errorMessage} actionLabel="Thử lại" onAction={loadRequests} />
      ) : requests.length === 0 ? (
        <EmptyState title="Chưa có yêu cầu liên hệ nào" description="Hiện tại chưa có khách hàng nào gửi biểu mẫu liên hệ." />
      ) : (
        <ContactRequestTable requests={requests} />
      )}
    </div>
  );
}