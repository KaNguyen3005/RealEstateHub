"use client";

import { useEffect } from "react";

import { useAuthStore } from "@/store/authStore";
import { restoreAuthSession } from "@/lib/auth-session";

export function AuthBootstrap() {
  const setAuth = useAuthStore((state) => state.setAuth);
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const beginBootstrap = useAuthStore((state) => state.beginBootstrap);
  const finishBootstrap = useAuthStore((state) => state.finishBootstrap);

  useEffect(() => {
    let isMounted = true;

    beginBootstrap();

    const restoreSession = async () => {
      try {
        const session = await restoreAuthSession();

        if (!isMounted) {
          return;
        }

        if (session) {
          setAuth(session.user, session.accessToken);
        } else {
          clearAuth();
        }
      } catch {
        if (isMounted) {
          clearAuth();
        }
      } finally {
        if (isMounted) {
          finishBootstrap();
        }
      }
    };

    void restoreSession();

    return () => {
      isMounted = false;
    };
  }, [beginBootstrap, clearAuth, finishBootstrap, setAuth]);

  return null;
}
