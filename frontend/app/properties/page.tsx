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
    errorMessage = error instanceof Error ? error.message : "Failed to load properties.";
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
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary/80">Properties</p>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Browse approved properties
          </h1>
          <p className="max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
            Search, filter, compare, and save homes that match your next move.
          </p>
        </div>
        <Button asChild variant="outline">
          <Link href="/dashboard/properties/new">List a property</Link>
        </Button>
      </div>

      <div className="space-y-6">
        <PropertyFilter values={searchParams} />

        {errorMessage ? (
          <EmptyState title="Properties could not load" description={errorMessage} actionLabel="Try again" actionHref="/properties" />
        ) : data.items.length === 0 ? (
          <EmptyState title="No properties found" description="Try changing the filters or search keyword." actionLabel="Clear filters" actionHref="/properties" />
        ) : (
          <>
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>{data.totalItems} properties found</span>
              <span>
                Page {data.page} of {data.totalPages}
              </span>
            </div>
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {data.items.map((property) => (
                <PropertyCard key={property._id} property={property} />
              ))}
            </div>

            <div className="flex items-center justify-center gap-3">
              <Button asChild variant="outline" disabled={data.page <= 1}>
                <Link href={`/properties${buildPropertyQuery({ ...baseParams, page: String(prevPage) })}`}>Previous</Link>
              </Button>
              <Button asChild variant="outline" disabled={data.page >= data.totalPages}>
                <Link href={`/properties${buildPropertyQuery({ ...baseParams, page: String(nextPage) })}`}>Next</Link>
              </Button>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
