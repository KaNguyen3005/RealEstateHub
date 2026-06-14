"use client";

import { ChangeEvent, DragEvent, useEffect, useMemo, useRef, useState } from "react";
import { ImagePlus, Loader2, Trash2, UploadCloud } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { uploadPropertyImages } from "@/lib/uploads";
import { useAuthStore } from "@/store/authStore";

const allowedImageTypes = ["image/jpeg", "image/png", "image/webp"];
const maxImageCount = 10;
const maxImageSizeBytes = 5 * 1024 * 1024;

interface ImageUploadBoxProps {
  value: string[];
  onChange: (urls: string[]) => void;
  error?: string;
}

function formatFileSize(bytes: number) {
  return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
}

function validateFiles(files: File[], currentCount: number) {
  if (currentCount + files.length > maxImageCount) {
    return `You can upload up to ${maxImageCount} images.`;
  }

  const invalidType = files.find((file) => !allowedImageTypes.includes(file.type));
  if (invalidType) {
    return "Only JPG, PNG, and WEBP images are allowed.";
  }

  const oversized = files.find((file) => file.size > maxImageSizeBytes);
  if (oversized) {
    return `${oversized.name} is ${formatFileSize(oversized.size)}. Each image must be 5MB or smaller.`;
  }

  return null;
}

export function ImageUploadBox({ value, onChange, error }: ImageUploadBoxProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const accessToken = useAuthStore((state) => state.accessToken);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [pendingPreviews, setPendingPreviews] = useState<string[]>([]);

  const previewImages = useMemo(() => [...value, ...pendingPreviews], [pendingPreviews, value]);

  useEffect(() => {
    return () => {
      pendingPreviews.forEach((preview) => URL.revokeObjectURL(preview));
    };
  }, [pendingPreviews]);

  const uploadFiles = async (selectedFiles: File[]) => {
    const files = selectedFiles.filter(Boolean);

    if (files.length === 0) {
      return;
    }

    setLocalError(null);

    const validationError = validateFiles(files, value.length);
    if (validationError) {
      setLocalError(validationError);
      return;
    }

    if (!accessToken) {
      setLocalError("Please log in as a seller or admin before uploading images.");
      return;
    }

    const previews = files.map((file) => URL.createObjectURL(file));
    setPendingPreviews((current) => [...current, ...previews]);
    setIsUploading(true);

    try {
      const uploadedUrls = await uploadPropertyImages(files, accessToken);
      onChange([...value, ...uploadedUrls].slice(0, maxImageCount));
    } catch (uploadError) {
      setLocalError(uploadError instanceof Error ? uploadError.message : "Image upload failed. Please try another image.");
    } finally {
      setIsUploading(false);
      setPendingPreviews((current) => {
        previews.forEach((preview) => URL.revokeObjectURL(preview));
        return current.filter((preview) => !previews.includes(preview));
      });
    }
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    void uploadFiles(Array.from(event.target.files ?? []));
    event.target.value = "";
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    void uploadFiles(Array.from(event.dataTransfer.files));
  };

  const removeImage = (url: string) => {
    onChange(value.filter((imageUrl) => imageUrl !== url));
  };

  return (
    <div className="space-y-3">
      <div
        className={cn(
          "rounded-lg border border-dashed border-border bg-muted/30 p-5 transition",
          isDragging && "border-primary bg-primary/5",
          error && "border-destructive"
        )}
        onDragOver={(event) => {
          event.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
      >
        <input
          ref={inputRef}
          type="file"
          className="sr-only"
          accept={allowedImageTypes.join(",")}
          multiple
          onChange={handleFileChange}
        />

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <span className="mt-1 inline-flex h-10 w-10 items-center justify-center rounded-md bg-background text-primary shadow-sm">
              {isUploading ? <Loader2 className="h-5 w-5 animate-spin" /> : <UploadCloud className="h-5 w-5" />}
            </span>
            <div>
              <p className="text-sm font-semibold text-foreground">Upload property images</p>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                JPG, PNG, or WEBP. Up to 10 images, 5MB each.
              </p>
            </div>
          </div>

          <Button type="button" variant="outline" onClick={() => inputRef.current?.click()} disabled={isUploading || value.length >= maxImageCount}>
            <ImagePlus className="h-4 w-4" />
            {isUploading ? "Uploading..." : "Choose images"}
          </Button>
        </div>
      </div>

      {previewImages.length > 0 ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {previewImages.map((imageUrl) => {
            const isPending = pendingPreviews.includes(imageUrl);

            return (
              <div key={imageUrl} className="group relative overflow-hidden rounded-lg border border-border bg-muted">
                <img src={imageUrl} alt="Property preview" className="aspect-[4/3] w-full object-cover" />
                {isPending ? (
                  <div className="absolute inset-0 grid place-items-center bg-black/40 text-sm font-medium text-white">
                    Uploading...
                  </div>
                ) : (
                  <Button
                    type="button"
                    size="icon"
                    variant="destructive"
                    className="absolute right-2 top-2 h-8 w-8 opacity-95"
                    onClick={() => removeImage(imageUrl)}
                    aria-label="Remove image"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            );
          })}
        </div>
      ) : null}

      <div className="flex items-center justify-between gap-3 text-xs text-muted-foreground">
        <span>{value.length} of {maxImageCount} images uploaded</span>
        {isUploading ? <span>Uploading...</span> : null}
      </div>

      {localError ? <p className="text-sm text-destructive">{localError}</p> : null}
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
    </div>
  );
}
