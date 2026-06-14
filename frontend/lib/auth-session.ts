import { apiClient, ApiClientError } from "@/lib/api";
import type { User } from "@/types/user";

export interface RestoredAuthSession {
  user: User;
  accessToken: string;
}

const RESTORE_SESSION_TIMEOUT_MS = 8000;
let restoreSessionPromise: Promise<RestoredAuthSession | null> | null = null;

export async function restoreAuthSession(): Promise<RestoredAuthSession | null> {
  if (restoreSessionPromise) {
    return restoreSessionPromise;
  }

  restoreSessionPromise = (async () => {
    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => {
      controller.abort();
    }, RESTORE_SESSION_TIMEOUT_MS);

    try {
      const refreshResponse = await apiClient.post<{ user: User; accessToken: string }>(
        "/api/auth/refresh",
        undefined,
        {
          signal: controller.signal,
        }
      );

      const accessToken = refreshResponse.data?.accessToken;

      if (!accessToken) {
        throw new Error("Refresh response is incomplete");
      }

      const meResponse = await apiClient.get<{ user: User }>("/api/auth/me", {
        token: accessToken,
        signal: controller.signal,
      });

      const user = meResponse.data?.user;

      if (!user) {
        throw new Error("Current user response is incomplete");
      }

      return {
        user,
        accessToken,
      };
    } catch (error) {
      if (error instanceof ApiClientError && error.status !== 401 && error.status !== 403) {
        // Non-auth failures should still fall back to guest state during bootstrap.
      }

      return null;
    } finally {
      window.clearTimeout(timeoutId);
    }
  })();

  try {
    return await restoreSessionPromise;
  } finally {
    restoreSessionPromise = null;
  }
}
