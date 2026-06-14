import { apiClient } from "@/lib/api";

export async function uploadPropertyImages(files: File[], token: string) {
  const formData = new FormData();

  files.forEach((file) => {
    formData.append("images", file);
  });

  const response = await apiClient.post<{ urls: string[] }>("/api/uploads/properties", formData, {
    token,
  });

  return response.data?.urls ?? [];
}
