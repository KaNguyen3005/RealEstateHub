"use client";

import { useCallback, useEffect, useState } from "react";

import { UserManagementTable } from "@/components/admin/user-management-table";
import { EmptyState } from "@/components/common/empty-state";
import { LoadingSpinner } from "@/components/common/loading-spinner";
import { getAdminUsers, updateAdminUserRole, updateAdminUserStatus } from "@/lib/admin";
import { useAuthStore } from "@/store/authStore";
import type { UserStatus } from "@/types/admin";
import type { User, UserRole } from "@/types/user";

export default function AdminUsersPage() {
  const accessToken = useAuthStore((state) => state.accessToken);
  const authStatus = useAuthStore((state) => state.status);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loadUsers = useCallback(async () => {
    if (authStatus === "bootstrapping") {
      return;
    }

    if (!accessToken) {
      setErrorMessage("Please login again before managing users.");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const data = await getAdminUsers(accessToken);
      setUsers(data.items);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Failed to load users.");
    } finally {
      setIsLoading(false);
    }
  }, [accessToken, authStatus]);

  useEffect(() => {
    void loadUsers();
  }, [loadUsers]);

  const handleUpdateRole = async (userId: string, role: UserRole) => {
    if (!accessToken) return;

    const updatedUser = await updateAdminUserRole(userId, role, accessToken);
    if (updatedUser) {
      setUsers((current) => current.map((user) => (user._id === userId ? updatedUser : user)));
    }
  };

  const handleUpdateStatus = async (userId: string, status: UserStatus) => {
    if (!accessToken) return;

    const updatedUser = await updateAdminUserStatus(userId, status, accessToken);
    if (updatedUser) {
      setUsers((current) => current.map((user) => (user._id === userId ? updatedUser : user)));
    }
  };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-semibold text-foreground">User management</h2>
        <p className="mt-2 text-sm text-muted-foreground">Review roles and block or activate platform accounts.</p>
      </div>

      {isLoading ? (
        <LoadingSpinner label="Loading users..." />
      ) : errorMessage ? (
        <EmptyState title="Users could not load" description={errorMessage} actionLabel="Try again" onAction={loadUsers} />
      ) : users.length === 0 ? (
        <EmptyState title="No users found" description="No account matches the current admin query." />
      ) : (
        <UserManagementTable users={users} onUpdateRole={handleUpdateRole} onUpdateStatus={handleUpdateStatus} />
      )}
    </div>
  );
}
