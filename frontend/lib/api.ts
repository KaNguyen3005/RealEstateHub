import { clientEnv } from "@/lib/env";
import type { ApiClientErrorPayload, ApiResponse } from "@/types/api";

type JsonBody = Record<string, unknown> | Array<unknown>;

export interface ApiRequestOptions extends Omit<RequestInit, "body" | "headers"> {
  body?: BodyInit | JsonBody | null;
  token?: string | null;
  headers?: HeadersInit;
}

export class ApiClientError<T = unknown> extends Error {
  status: number;
  data?: T;
  errors?: unknown;

  constructor(payload: ApiClientErrorPayload<T>) {
    super(payload.message);
    this.name = "ApiClientError";
    this.status = payload.status;
    this.data = payload.data;
    this.errors = payload.errors;
  }
}

function normalizePath(path: string) {
  if (!path) return "/";
  return path.startsWith("/") ? path : `/${path}`;
}

function buildUrl(path: string) {
  if (!clientEnv.apiUrl) {
    throw new Error("NEXT_PUBLIC_API_URL is not configured.");
  }

  return new URL(normalizePath(path), `${clientEnv.apiUrl}/`).toString();
}

function isJsonBody(body: ApiRequestOptions["body"]): body is JsonBody {
  return Boolean(
    body &&
      typeof body === "object" &&
      !(body instanceof FormData) &&
      !(body instanceof URLSearchParams) &&
      !(body instanceof Blob) &&
      !(body instanceof ArrayBuffer) &&
      !(body instanceof ReadableStream)
  );
}

async function parseJsonResponse<T>(response: Response): Promise<ApiResponse<T> | null> {
  const contentType = response.headers.get("content-type") ?? "";

  if (!contentType.includes("application/json")) {
    return null;
  }

  return (await response.json()) as ApiResponse<T>;
}

export async function apiRequest<TResponse>(
  path: string,
  options: ApiRequestOptions = {}
): Promise<ApiResponse<TResponse>> {
  const headers = new Headers(options.headers);
  headers.set("Accept", "application/json");

  if (options.token) {
    headers.set("Authorization", `Bearer ${options.token}`);
  }

  let body = options.body ?? null;

  if (isJsonBody(body)) {
    headers.set("Content-Type", "application/json");
    body = JSON.stringify(body);
  }

  const response = await fetch(buildUrl(path), {
    ...options,
    body,
    headers,
    cache: options.cache ?? "no-store"
  });

  const payload = (await parseJsonResponse<TResponse>(response)) ?? {
    success: response.ok,
    message: response.ok ? "Request completed successfully" : "Request failed"
  };

  if (!response.ok) {
    throw new ApiClientError<TResponse>({
      status: response.status,
      message: payload.message,
      data: payload.data,
      errors: payload.errors
    });
  }

  return payload;
}

export const apiClient = {
  get<TResponse>(path: string, options?: Omit<ApiRequestOptions, "method" | "body">) {
    return apiRequest<TResponse>(path, { ...options, method: "GET" });
  },
  post<TResponse>(path: string, body?: ApiRequestOptions["body"], options?: Omit<ApiRequestOptions, "method">) {
    return apiRequest<TResponse>(path, { ...options, method: "POST", body });
  },
  put<TResponse>(path: string, body?: ApiRequestOptions["body"], options?: Omit<ApiRequestOptions, "method">) {
    return apiRequest<TResponse>(path, { ...options, method: "PUT", body });
  },
  patch<TResponse>(path: string, body?: ApiRequestOptions["body"], options?: Omit<ApiRequestOptions, "method">) {
    return apiRequest<TResponse>(path, { ...options, method: "PATCH", body });
  },
  delete<TResponse>(path: string, options?: Omit<ApiRequestOptions, "method" | "body">) {
    return apiRequest<TResponse>(path, { ...options, method: "DELETE" });
  }
};
