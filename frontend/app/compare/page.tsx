"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { X } from "lucide-react";

import { EmptyState } from "@/components/common/empty-state";
import { LoadingSpinner } from "@/components/common/loading-spinner";
import { PropertyStatusBadge } from "@/components/property/property-status-badge";
import { Button } from "@/components/ui/button";
import { formatAddress, formatPrice, formatPropertyPurpose, formatPropertyType } from "@/lib/property-format";
import { getCompareProperties } from "@/lib/properties";
import { useCompareStore } from "@/store/compareStore";
import type { Property } from "@/types/property";

export default function ComparePage() {
  const propertyIds = useCompareStore((state) => state.propertyIds);
  const removeFromCompare = useCompareStore((state) => state.removeFromCompare);
  const clearCompare = useCompareStore((state) => state.clearCompare);
  const [items, setItems] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadCompare = async () => {
      if (propertyIds.length === 0) {
        setItems([]);
        return;
      }

      setIsLoading(true);
      setErrorMessage(null);

      try {
        const properties = await getCompareProperties(propertyIds);
        if (isMounted) {
          setItems(properties);
        }
      } catch (error) {
        if (isMounted) {
          setErrorMessage(error instanceof Error ? error.message : "Không thể tải danh sách so sánh.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void loadCompare();

    return () => {
      isMounted = false;
    };
  }, [propertyIds]);

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="space-y-3">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary/80">So sánh</p>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">So sánh tối đa 3 bất động sản</h1>
          <p className="max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
            Đối chiếu giá cả, vị trí, diện tích và trạng thái của các dự án đặt cạnh nhau.
          </p>
        </div>
        {propertyIds.length > 0 ? (
          <Button type="button" variant="outline" onClick={clearCompare}>
            Xóa danh sách so sánh
          </Button>
        ) : null}
      </div>

      {isLoading ? (
        <div className="flex min-h-[40vh] items-center justify-center">
          <LoadingSpinner label="Đang tải dữ liệu so sánh..." />
        </div>
      ) : errorMessage ? (
        <EmptyState title="Không thể tải dữ liệu so sánh" description={errorMessage} actionLabel="Khám phá nhà đất" actionHref="/properties" />
      ) : items.length === 0 ? (
        <EmptyState title="Chưa chọn bất động sản nào" description="Hãy thêm các bất động sản từ trang danh sách để so sánh đối chiếu tại đây." actionLabel="Khám phá nhà đất" actionHref="/properties" />
      ) : (
        <div className="overflow-hidden rounded-lg border border-border/70 bg-background/90 shadow-sm">
          <div className="grid min-w-[760px]" style={{ gridTemplateColumns: `180px repeat(${items.length}, minmax(180px, 1fr))` }}>
            <div className="border-b border-border/70 bg-muted/40 p-4 text-sm font-semibold">Thông số</div>
            {items.map((item) => (
              <div key={item._id} className="border-b border-l border-border/70 p-4">
                <div className="flex items-start justify-between gap-3">
                  <Link href={`/properties/${item._id}`} className="line-clamp-2 text-sm font-semibold text-foreground hover:text-primary">
                    {item.title}
                  </Link>
                  <Button type="button" variant="ghost" size="icon" onClick={() => removeFromCompare(item._id)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}

            {[
              ["Trạng thái", (item: Property) => <PropertyStatusBadge status={item.status} />],
              ["Mức giá", (item: Property) => formatPrice(item.price, item.purpose)],
              ["Nhu cầu", (item: Property) => formatPropertyPurpose(item.purpose)],
              ["Loại hình", (item: Property) => formatPropertyType(item.type)],
              ["Diện tích", (item: Property) => `${item.area} m²`],
              ["Phòng ngủ", (item: Property) => item.bedrooms],
              ["Phòng tắm", (item: Property) => item.bathrooms],
              ["Địa chỉ", (item: Property) => formatAddress(item)],
            ].map(([label, render]) => (
              <div key={String(label)} className="contents">
                <div className="border-b border-border/70 bg-muted/30 p-4 text-sm font-semibold">{String(label)}</div>
                {items.map((item) => (
                  <div key={`${item._id}-${String(label)}`} className="border-b border-l border-border/70 p-4 text-sm text-muted-foreground">
                    {typeof render === "function" ? render(item) : null}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}