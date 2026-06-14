"use client";

import type { ReactNode } from "react";
import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

import { LoadingSpinner } from "@/components/common/loading-spinner";
import { useAuthStore } from "@/store/authStore";

interface ProtectedRouteProps {
  children: ReactNode;
  fallbackLabel?: string;
}

export function ProtectedRoute({
  children,
  fallbackLabel = "Checking your session..."
}: ProtectedRouteProps) {
  const router = useRouter();
  const pathname = usePathname();
  const authStatus = useAuthStore((state) => state.status);
  const isResolvingAuth = authStatus === "bootstrapping";
  const isAuthenticated = authStatus === "authenticated";

  useEffect(() => {
    if (isResolvingAuth || isAuthenticated) {
      return;
    }

    const query = window.location.search.replace(/^\?/, "");
    const nextPath = query ? `${pathname}?${query}` : pathname;
    router.replace(`/login?next=${encodeURIComponent(nextPath)}`);
  }, [isAuthenticated, isResolvingAuth, pathname, router]);

  if (isResolvingAuth) {
    return (
      <section className="mx-auto flex min-h-[50vh] w-full max-w-5xl items-center justify-center px-4 py-16">
        <LoadingSpinner label={fallbackLabel} />
      </section>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
