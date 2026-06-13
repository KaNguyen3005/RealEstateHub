"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { EmptyState } from "@/components/common/empty-state";
import { LoadingSpinner } from "@/components/common/loading-spinner";
import { PropertyForm } from "@/components/property/property-form";
import { getPropertyById, updateProperty } from "@/lib/properties";
import type { PropertyFormValues } from "@/lib/validations/property.schema";
import { useAuthStore } from "@/store/authStore";
import type { Property } from "@/types/property";

interface EditPropertyPageProps {
  params: {
    id: string;
  };
}

export default function EditPropertyPage({ params }: EditPropertyPageProps) {
  const router = useRouter();
  const accessToken = useAuthStore((state) => state.accessToken);
  const authStatus = useAuthStore((state) => state.status);
  const [property, setProperty] = useState<Property | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadProperty = async () => {
      if (authStatus === "bootstrapping") {
        return;
      }

      if (!accessToken) {
        if (isMounted) {
          setProperty(null);
          setErrorMessage("Please login again before editing this property.");
          setIsLoading(false);
        }
        return;
      }

      setIsLoading(true);
      setErrorMessage(null);

      try {
        const item = await getPropertyById(params.id, accessToken);
        if (isMounted) {
          setProperty(item);
        }
      } catch (error) {
        if (isMounted) {
          setErrorMessage(error instanceof Error ? error.message : "Failed to load property.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void loadProperty();

    return () => {
      isMounted = false;
    };
  }, [accessToken, authStatus, params.id]);

  const handleSubmit = async (values: PropertyFormValues) => {
    if (!accessToken) {
      throw new Error("Please login again before updating a property.");
    }

    await updateProperty(params.id, values, accessToken);
    router.replace("/dashboard/properties");
    router.refresh();
  };

  return (
    <section className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 space-y-2">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary/80">Seller dashboard</p>
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">Edit property</h1>
        <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
          Seller edits to approved properties may require approval again.
        </p>
      </div>

      {isLoading ? (
        <div className="flex min-h-[40vh] items-center justify-center">
          <LoadingSpinner label="Loading property..." />
        </div>
      ) : errorMessage ? (
        <EmptyState title="Property could not load" description={errorMessage} actionLabel="Back to properties" actionHref="/dashboard/properties" />
      ) : property ? (
        <PropertyForm initialProperty={property} submitLabel="Update property" onSubmit={handleSubmit} />
      ) : (
        <EmptyState title="Property not found" description="This property may have been removed." actionLabel="Back to properties" actionHref="/dashboard/properties" />
      )}
    </section>
  );
}
