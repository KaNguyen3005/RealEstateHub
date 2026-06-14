"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

import { LoadingButton } from "@/components/common/loading-button";
import { apiClient } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";

interface LogoutButtonProps {
  className?: string;
  onLogoutStart?: () => void;
}

export function LogoutButton({ className, onLogoutStart }: LogoutButtonProps) {
  const router = useRouter();
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    if (isLoggingOut) {
      return;
    }

    setIsLoggingOut(true);
    onLogoutStart?.();

    try {
      await apiClient.post("/api/auth/logout");
    } catch {
      // Keep logging out locally even if the server request fails.
    } finally {
      clearAuth();
      setIsLoggingOut(false);
      router.push("/login?loggedOut=1");
    }
  };

  return (
    <LoadingButton
      type="button"
      variant="ghost"
      loading={isLoggingOut}
      onClick={handleLogout}
      className={className}
    >
      <LogOut className="h-4 w-4" />
      Logout
    </LoadingButton>
  );
}
