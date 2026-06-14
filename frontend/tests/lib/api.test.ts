import { afterEach, describe, expect, it, vi } from "vitest";

describe("api client", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.resetModules();
  });

  it("sends JSON requests with auth headers", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          success: true,
          message: "Created",
          data: { id: "item-1" },
        }),
        {
          status: 201,
          headers: { "Content-Type": "application/json" },
        }
      )
    );
    vi.stubGlobal("fetch", fetchMock);

    const { apiClient } = await import("@/lib/api");
    const response = await apiClient.post<{ id: string }>(
      "/api/items",
      { name: "Item" },
      { token: "access-token" }
    );

    expect(response.data).toEqual({ id: "item-1" });
    expect(fetchMock).toHaveBeenCalledTimes(1);

    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    const headers = init.headers as Headers;

    expect(url).toBe("http://localhost:5000/api/items");
    expect(init.method).toBe("POST");
    expect(init.credentials).toBe("include");
    expect(init.cache).toBe("no-store");
    expect(init.body).toBe(JSON.stringify({ name: "Item" }));
    expect(headers.get("Accept")).toBe("application/json");
    expect(headers.get("Content-Type")).toBe("application/json");
    expect(headers.get("Authorization")).toBe("Bearer access-token");
  });

  it("throws ApiClientError for JSON error responses", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockImplementation(() =>
        Promise.resolve(
          new Response(
            JSON.stringify({
              success: false,
              message: "Validation error",
              errors: { name: ["Name is required"] },
            }),
            {
              status: 400,
              headers: { "Content-Type": "application/json" },
            }
          )
        )
      )
    );

    const { ApiClientError, apiClient } = await import("@/lib/api");

    await expect(apiClient.get("/api/items")).rejects.toMatchObject({
      name: "ApiClientError",
      status: 400,
      message: "Validation error",
      errors: { name: ["Name is required"] },
    });
    await expect(apiClient.get("/api/items")).rejects.toBeInstanceOf(ApiClientError);
  });
});
