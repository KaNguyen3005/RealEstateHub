const normalizeUrl = (value: string | undefined) => {
  if (!value) return "";
  return value.endsWith("/") ? value.slice(0, -1) : value;
};

export const serverEnv = {
  backendApiUrl: normalizeUrl(process.env.BACKEND_API_URL)
} as const;

export function requireBackendApiUrl() {
  if (!serverEnv.backendApiUrl) {
    throw new Error("BACKEND_API_URL is not configured.");
  }

  return serverEnv.backendApiUrl;
}
