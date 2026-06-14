import { create } from "zustand";

import type { User } from "@/types/user";

export type AuthStatus = "bootstrapping" | "authenticated" | "guest";

interface AuthState {
  user: User | null;
  accessToken: string | null;
  status: AuthStatus;
  isAuthenticated: boolean;
  isLoading: boolean;
  hasBootstrapped: boolean;
  setAuth: (user: User, accessToken: string) => void;
  clearAuth: () => void;
  beginBootstrap: () => void;
  finishBootstrap: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  accessToken: null,
  status: "bootstrapping",
  isAuthenticated: false,
  isLoading: true,
  hasBootstrapped: false,
  setAuth: (user, accessToken) =>
    set({
      user,
      accessToken,
      status: "authenticated",
      isAuthenticated: true,
      isLoading: false,
      hasBootstrapped: true
    }),
  clearAuth: () =>
    set({
      user: null,
      accessToken: null,
      status: "guest",
      isAuthenticated: false,
      isLoading: false,
      hasBootstrapped: true
    }),
  beginBootstrap: () =>
    set({
      status: "bootstrapping",
      isLoading: true,
      hasBootstrapped: false
    }),
  finishBootstrap: () => {
    const currentStatus = get().status;

    set({
      status: currentStatus === "bootstrapping" ? "guest" : currentStatus,
      isLoading: false,
      hasBootstrapped: true
    });
  }
}));

export const authStore = useAuthStore;
