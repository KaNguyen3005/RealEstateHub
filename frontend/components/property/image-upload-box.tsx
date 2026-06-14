"use client";

import { useRef, useState } from "react";
import { ImagePlus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { uploadPropertyImages } from "@/lib/uploads";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/authStore";

interface ImageUploadBoxProps {
  value: string[];
  onChange: (urls: string[]) => void;
  errorMessage?: string;
}

const MAX_IMAGES = 10;

export function ImageUploadBox({ value, onChange, errorMessage }: ImageUploadBoxProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const accessToken = useAuthStore((state) => state.accessToken);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const remainingSlots = Math.max(MAX_IMAGES - value.length, 0);

  const handleFilesSelected = async (files: FileList | null) => {
    const selectedFiles = Array.from(files ?? []);

    if (inputRef.current) {
      inputRef.current.value = "";
    }

    if (selectedFiles.length === 0) {
      return;
    }

    setUploadError(null);

    if (!accessToken) {
      setUploadError("Vui lòng đăng nhập lại trước khi tải ảnh lên.");
      return;
    }

    if (remainingSlots <= 0) {
      setUploadError("Bạn chỉ có thể tải lên tối đa 10 hình ảnh.");
      return;
    }

    const filesToUpload = selectedFiles.slice(0, remainingSlots);

    try {
      setIsUploading(true);
      const uploadedUrls = await uploadPropertyImages(filesToUpload, accessToken);
      onChange([...value, ...uploadedUrls].slice(0, MAX_IMAGES));
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : "Tải ảnh lên thất bại. Vui lòng thử lại với ảnh khác.");
    } finally {
      setIsUploading(false);
    }
  };

  const removeImage = (imageUrl: string) => {
    onChange(value.filter((item) => item !== imageUrl));
  };

  return (
    <div className="space-y-3">
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        multiple
        className="hidden"
        onChange={(event) => handleFilesSelected(event.target.files)}
      />

      <div
        className={cn(
          "rounded-lg border border-dashed border-border/80 bg-muted/20 p-4",
          errorMessage && "border-destructive"
        )}
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-foreground">Hình ảnh bất động sản</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Tải lên từ 1-10 ảnh. Hỗ trợ định dạng JPEG, PNG và WEBP.
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            disabled={isUploading || remainingSlots === 0}
            onClick={() => inputRef.current?.click()}
          >
            <ImagePlus className="h-4 w-4" />
            {isUploading ? "Đang tải lên..." : "Tải ảnh lên"}
          </Button>
        </div>

        <p className="mt-3 text-xs text-muted-foreground">Đã tải lên {value.length} / {MAX_IMAGES} ảnh</p>

        {value.length > 0 ? (
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {value.map((imageUrl) => (
              <div key={imageUrl} className="group relative aspect-[4/3] overflow-hidden rounded-md border border-border/70 bg-muted">
                <img src={imageUrl} alt="Bất động sản đã tải lên" className="h-full w-full object-cover" />
                <Button
                  type="button"
                  size="icon"
                  variant="destructive"
                  className="absolute right-2 top-2 h-8 w-8 opacity-100 sm:opacity-0 sm:transition sm:group-hover:opacity-100"
                  onClick={() => removeImage(imageUrl)}
                  aria-label="Xóa ảnh này"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        ) : null}
      </div>

      {errorMessage ? <p className="text-sm text-destructive">{errorMessage}</p> : null}
      {uploadError ? <p className="text-sm text-destructive">{uploadError}</p> : null}
    </div>
  );
}