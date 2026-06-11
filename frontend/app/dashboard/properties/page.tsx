"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Edit, Plus, Trash2 } from "lucide-react";

import { EmptyState } from "@/components/common/empty-state";
import { LoadingSpinner } from "@/components/common/loading-spinner";
import { PropertyStatusBadge } from "@/components/property/property-status-badge";
import { Button } from "@/components/ui/button";
import { formatAddress, formatPrice } from "@/lib/property-format";
import { deleteProperty, getProperties } from "@/lib/properties";
import { useAuthStore } from "@/store/authStore";
import type { Property } from "@/types/property";

export default function DashboardPropertiesPage() {
  const accessToken = useAuthStore((state) => state.accessToken);
  const [items, setItems] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const loadProperties = useCallback(async () => {
    if (!accessToken) {
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const data = await getProperties({ mine: "1", limit: "50" }, accessToken);
      setItems(data.items);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Failed to load your properties.");
    } finally {
      setIsLoading(false);
    }
  }, [accessToken]);

  useEffect(() => {
    void loadProperties();
  }, [loadProperties]);

  const handleDelete = async (propertyId: string) => {
    if (!accessToken || !window.confirm("Delete this property?")) {
      return;
    }

    setDeletingId(propertyId);

    try {
      await deleteProperty(propertyId, accessToken);
      setItems((currentItems) => currentItems.filter((item) => item._id !== propertyId));
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Failed to delete property.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="space-y-2">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary/80">Seller dashboard</p>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">My properties</h1>
          <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
            Manage your submitted properties and review their approval status.
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/properties/new">
            <Plus className="h-4 w-4" />
            New property
          </Link>
        </Button>
      </div>

      {isLoading ? (
        <div className="flex min-h-[40vh] items-center justify-center">
          <LoadingSpinner label="Loading your properties..." />
        </div>
      ) : errorMessage ? (
        <EmptyState title="Properties could not load" description={errorMessage} actionLabel="Try again" onAction={loadProperties} />
      ) : items.length === 0 ? (
        <EmptyState title="No properties yet" description="Create your first property listing and submit it for approval." actionLabel="Create property" actionHref="/dashboard/properties/new" />
      ) : (
        <div className="overflow-hidden rounded-lg border border-border/70 bg-background/90 shadow-sm">
          <div className="hidden grid-cols-[1.4fr_0.7fr_0.7fr_0.8fr_0.8fr] border-b border-border/70 bg-muted/40 px-4 py-3 text-sm font-semibold text-muted-foreground md:grid">
            <span>Property</span>
            <span>Price</span>
            <span>Status</span>
            <span>Updated</span>
            <span className="text-right">Actions</span>
          </div>
          <div className="divide-y divide-border/70">
            {items.map((property) => (
              <div key={property._id} className="grid gap-3 px-4 py-4 md:grid-cols-[1.4fr_0.7fr_0.7fr_0.8fr_0.8fr] md:items-center">
                <div>
                  <Link href={`/properties/${property._id}`} className="font-semibold text-foreground hover:text-primary">
                    {property.title}
                  </Link>
                  <p className="mt-1 line-clamp-1 text-sm text-muted-foreground">{formatAddress(property)}</p>
                </div>
                <p className="text-sm font-medium text-foreground">{formatPrice(property.price, property.purpose)}</p>
                <PropertyStatusBadge status={property.status} />
                <p className="text-sm text-muted-foreground">{new Date(property.updatedAt).toLocaleDateString("vi-VN")}</p>
                <div className="flex justify-start gap-2 md:justify-end">
                  <Button asChild size="sm" variant="outline">
                    <Link href={`/dashboard/properties/${property._id}/edit`}>
                      <Edit className="h-4 w-4" />
                      Edit
                    </Link>
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    disabled={deletingId === property._id}
                    className="text-destructive hover:text-destructive"
                    onClick={() => handleDelete(property._id)}
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
