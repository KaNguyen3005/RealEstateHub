import { beforeEach, describe, expect, it } from "vitest";

import { useAuthStore } from "@/store/authStore";
import type { User } from "@/types/user";

const testUser: User = {
  _id: "user-1",
  fullName: "Test User",
  email: "user@example.com",
  role: "user",
  status: "active",
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-01T00:00:00.000Z",
};

function resetAuthStore() {
  useAuthStore.setState({
    user: null,
    accessToken: null,
    status: "bootstrapping",
    isAuthenticated: false,
    isLoading: true,
    hasBootstrapped: false,
  });
}

describe("auth store", () => {
  beforeEach(resetAuthStore);

  it("stores authenticated user state", () => {
    useAuthStore.getState().setAuth(testUser, "access-token");

    expect(useAuthStore.getState()).toMatchObject({
      user: testUser,
      accessToken: "access-token",
      status: "authenticated",
      isAuthenticated: true,
      isLoading: false,
      hasBootstrapped: true,
    });
  });

  it("clears auth state for guests", () => {
    useAuthStore.getState().setAuth(testUser, "access-token");
    useAuthStore.getState().clearAuth();

    expect(useAuthStore.getState()).toMatchObject({
      user: null,
      accessToken: null,
      status: "guest",
      isAuthenticated: false,
      isLoading: false,
      hasBootstrapped: true,
    });
  });

  it("finishes bootstrap as guest when no authenticated state was set", () => {
    useAuthStore.getState().beginBootstrap();
    useAuthStore.getState().finishBootstrap();

    expect(useAuthStore.getState()).toMatchObject({
      status: "guest",
      isLoading: false,
      hasBootstrapped: true,
    });
  });
});
