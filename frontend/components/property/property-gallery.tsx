"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Expand, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PropertyGalleryProps {
  title: string;
  images: string[];
}

const fallbackImage = "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=80";

export function PropertyGallery({ title, images }: PropertyGalleryProps) {
  const normalizedImages = useMemo(() => (images.length > 0 ? images.slice(0, 10) : [fallbackImage]), [images]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [viewerOpen, setViewerOpen] = useState(false);
  const activeImage = normalizedImages[activeIndex] ?? normalizedImages[0];
  const hasMultipleImages = normalizedImages.length > 1;

  const showPreviousImage = useCallback(() => {
    setActiveIndex((currentIndex) =>
      currentIndex === 0 ? normalizedImages.length - 1 : currentIndex - 1
    );
  }, [normalizedImages.length]);

  const showNextImage = useCallback(() => {
    setActiveIndex((currentIndex) =>
      currentIndex === normalizedImages.length - 1 ? 0 : currentIndex + 1
    );
  }, [normalizedImages.length]);

  useEffect(() => {
    setActiveIndex(0);
  }, [normalizedImages]);

  useEffect(() => {
    if (!viewerOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setViewerOpen(false);
      }

      if (event.key === "ArrowLeft" && hasMultipleImages) {
        showPreviousImage();
      }

      if (event.key === "ArrowRight" && hasMultipleImages) {
        showNextImage();
      }
    };

    const originalOverflow = document.body.style.overflow;

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [hasMultipleImages, showNextImage, showPreviousImage, viewerOpen]);

  return (
    <div className="space-y-3">
      <button
        type="button"
        className="group relative block aspect-[16/10] w-full overflow-hidden rounded-lg border border-border/70 bg-muted text-left"
        onClick={() => setViewerOpen(true)}
        aria-label={`Mở bộ sưu tập ảnh cho bài đăng ${title}`}
      >
        <img src={activeImage} alt={title} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
        <span className="absolute bottom-3 right-3 inline-flex items-center gap-2 rounded-md bg-background/90 px-3 py-2 text-xs font-semibold text-foreground shadow-sm">
          <Expand className="h-4 w-4" />
          Xem hình ảnh
        </span>
      </button>

      {hasMultipleImages ? (
        <div className="grid grid-cols-4 gap-3 sm:grid-cols-5 lg:grid-cols-6">
          {normalizedImages.map((image, index) => (
            <button
              key={`${image}-${index}`}
              type="button"
              className={cn(
                "aspect-[4/3] overflow-hidden rounded-md border bg-muted transition",
                activeIndex === index ? "border-primary ring-2 ring-primary/30" : "border-border/70 hover:border-primary/50"
              )}
              onClick={() => setActiveIndex(index)}
              aria-label={`Hiển thị hình ảnh ${index + 1} của bài đăng ${title}`}
            >
              <img src={image} alt={`Hình ảnh ${index + 1} của bài đăng ${title}`} className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      ) : null}

      {viewerOpen ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Trình xem ảnh của bài đăng ${title}`}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 p-4"
          onMouseDown={() => setViewerOpen(false)}
        >
          <div className="relative flex max-h-[92vh] w-full max-w-6xl items-center justify-center" onMouseDown={(event) => event.stopPropagation()}>
            <Button
              type="button"
              size="icon"
              variant="secondary"
              className="absolute right-0 top-0 z-10"
              onClick={() => setViewerOpen(false)}
              aria-label="Đóng trình xem ảnh"
            >
              <X className="h-5 w-5" />
            </Button>

            {hasMultipleImages ? (
              <Button
                type="button"
                size="icon"
                variant="secondary"
                className="absolute left-0 z-10"
                onClick={showPreviousImage}
                aria-label="Hiển thị hình ảnh trước đó"
              >
                <ChevronLeft className="h-6 w-6" />
              </Button>
            ) : null}

            <img
              src={activeImage}
              alt={`Hình ảnh ${activeIndex + 1} của bài đăng ${title}`}
              className="max-h-[88vh] max-w-[95vw] rounded-lg object-contain shadow-2xl"
            />

            {hasMultipleImages ? (
              <Button
                type="button"
                size="icon"
                variant="secondary"
                className="absolute right-0 z-10"
                onClick={showNextImage}
                aria-label="Hiển thị hình ảnh tiếp theo"
              >
                <ChevronRight className="h-6 w-6" />
              </Button>
            ) : null}

            <p className="absolute bottom-0 rounded-md bg-black/70 px-3 py-1.5 text-xs font-medium text-white">
              {activeIndex + 1} / {normalizedImages.length}
            </p>
          </div>
        </div>
      ) : null}
    </div>
  );
}