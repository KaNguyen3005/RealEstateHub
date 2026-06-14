const normalizeUrl = (value: string | undefined) => {
  if (!value) return "";
  return value.endsWith("/") ? value.slice(0, -1) : value;
};

export const clientEnv = {
  apiUrl: normalizeUrl(process.env.NEXT_PUBLIC_API_URL),
  socketUrl: normalizeUrl(process.env.NEXT_PUBLIC_SOCKET_URL)
} as const;
