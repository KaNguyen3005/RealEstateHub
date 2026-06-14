"use client";

import type { ReactNode } from "react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { LoadingSpinner } from "@/components/common/loading-spinner";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/authStore";
import type { UserRole } from "@/types/user";

interface RoleGuardProps {
  allowedRoles: UserRole[];
  children: ReactNode;
  fallbackPath?: string;
}

export function RoleGuard({
  allowedRoles,
  children,
  fallbackPath = "/"
}: RoleGuardProps) {
  const router = useRouter();
  const userRole = useAuthStore((state) => state.user?.role);
  const authStatus = useAuthStore((state) => state.status);
  const isResolvingAuth = authStatus === "bootstrapping";
  const isAuthenticated = authStatus === "authenticated";
  const isAllowed = Boolean(userRole && allowedRoles.includes(userRole));

  useEffect(() => {
    if (isResolvingAuth || !isAuthenticated || isAllowed) {
      return;
    }

    router.replace(fallbackPath);
  }, [fallbackPath, isAllowed, isAuthenticated, isResolvingAuth, router]);

  return (
    <ProtectedRoute>
      {isResolvingAuth ? (
        <section className="mx-auto flex min-h-[50vh] w-full max-w-5xl items-center justify-center px-4 py-16">
          <LoadingSpinner label="Đang kiểm tra quyền truy cập của bạn..." />
        </section>
      ) : isAllowed ? (
        children
      ) : (
        <section className="mx-auto flex min-h-[50vh] w-full max-w-5xl flex-col items-start justify-center gap-4 px-4 py-16 sm:px-6 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary/80">
            Truy cập bị hạn chế
          </p>
          <div className="space-y-2">
            <h1 className="text-3xl font-semibold tracking-tight text-foreground">
              Bạn không có quyền xem trang này.
            </h1>
            <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
              Khu vực này chỉ giới hạn cho một số vai trò tài khoản cụ thể.
            </p>
          </div>
          <Button type="button" onClick={() => router.replace(fallbackPath)}>
            Quay lại
          </Button>
        </section>
      )}
    </ProtectedRoute>
  );
}