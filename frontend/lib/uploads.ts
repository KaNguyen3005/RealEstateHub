import { apiClient } from "@/lib/api";

interface UploadPropertyImagesResult {
  urls: string[];
}

export async function uploadPropertyImages(files: File[], token: string) {
  const formData = new FormData();

  files.forEach((file) => {
    formData.append("images", file);
  });

  const response = await apiClient.post<UploadPropertyImagesResult>("/api/uploads/properties", formData, {
    token,
  });

  return response.data?.urls ?? [];
}
