import Link from "next/link";

import { EmptyState } from "@/components/common/empty-state";
import { PropertyCard } from "@/components/property/property-card";
import { PropertyFilter } from "@/components/property/property-filter";
import { Button } from "@/components/ui/button";
import { buildPropertyQuery, getProperties } from "@/lib/properties";
import type { PropertyListParams } from "@/types/property";

interface PropertiesPageProps {
  searchParams?: PropertyListParams;
}

export default async function PropertiesPage({ searchParams = {} }: PropertiesPageProps) {
  let data;
  let errorMessage: string | null = null;

  try {
    data = await getProperties({
      ...searchParams,
      limit: searchParams.limit ?? "9",
    });
  } catch (error) {
    errorMessage = error instanceof Error ? error.message : "Không thể tải danh sách bất động sản.";
    data = {
      items: [],
      page: 1,
      limit: 9,
      totalItems: 0,
      totalPages: 1,
    };
  }

  const prevPage = Math.max(data.page - 1, 1);
  const nextPage = Math.min(data.page + 1, data.totalPages);
  const baseParams = { ...searchParams, limit: String(data.limit) };

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="space-y-3">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary/80">Bất động sản</p>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Danh sách đã kiểm duyệt
          </h1>
          <p className="max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
            Tìm kiếm, sàng lọc, so sánh và lưu lại những không gian sống phù hợp với kế hoạch tiếp theo của bạn.
          </p>
        </div>
        <Button asChild variant="outline">
          <Link href="/dashboard/properties/new">Đăng tin chính chủ</Link>
        </Button>
      </div>

      <div className="space-y-6">
        <PropertyFilter values={searchParams} />

        {errorMessage ? (
          <EmptyState title="Không thể tải danh sách nhà đất" description={errorMessage} actionLabel="Thử lại" actionHref="/properties" />
        ) : data.items.length === 0 ? (
          <EmptyState title="Không tìm thấy bất động sản phù hợp" description="Hãy thử thay đổi bộ lọc hoặc từ khóa tìm kiếm khác." actionLabel="Xóa bộ lọc" actionHref="/properties" />
        ) : (
          <>
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>Tìm thấy {data.totalItems} bất động sản</span>
              <span>
                Trang {data.page} / {data.totalPages}
              </span>
            </div>
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {data.items.map((property) => (
                <PropertyCard key={property._id} property={property} />
              ))}
            </div>

            <div className="flex items-center justify-center gap-3">
              <Button asChild variant="outline" disabled={data.page <= 1}>
                <Link href={`/properties${buildPropertyQuery({ ...baseParams, page: String(prevPage) })}`}>Trang trước</Link>
              </Button>
              <Button asChild variant="outline" disabled={data.page >= data.totalPages}>
                <Link href={`/properties${buildPropertyQuery({ ...baseParams, page: String(nextPage) })}`}>Trang sau</Link>
              </Button>
            </div>
          </>
        )}
      </div>
    </section>
  );
}