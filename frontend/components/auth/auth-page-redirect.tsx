"use client";

import type { ReactNode } from "react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { getRoleHomePath, getSafeNextPath } from "@/lib/auth-redirect";
import { useAuthStore } from "@/store/authStore";

interface AuthPageRedirectProps {
  children: ReactNode;
  nextPath?: string | null;
}

export function AuthPageRedirect({ children, nextPath = null }: AuthPageRedirectProps) {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const authStatus = useAuthStore((state) => state.status);
  const isResolvingAuth = authStatus === "bootstrapping";
  const isAuthenticated = authStatus === "authenticated";

  useEffect(() => {
    if (isResolvingAuth || !isAuthenticated || !user) {
      return;
    }

    router.replace(getSafeNextPath(nextPath) || getRoleHomePath(user.role));
  }, [isAuthenticated, isResolvingAuth, nextPath, router, user]);

  return <>{children}</>;
}
