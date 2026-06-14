"use client";

import { useRouter } from "next/navigation";

import { PropertyForm } from "@/components/property/property-form";
import { createProperty } from "@/lib/properties";
import type { PropertyFormValues } from "@/lib/validations/property.schema";
import { useAuthStore } from "@/store/authStore";

export default function NewPropertyPage() {
  const router = useRouter();
  const accessToken = useAuthStore((state) => state.accessToken);

  const handleSubmit = async (values: PropertyFormValues) => {
    if (!accessToken) {
      throw new Error("Please login again before creating a property.");
    }

    await createProperty(values, accessToken);
    router.replace("/dashboard/properties");
    router.refresh();
  };

  return (
    <section className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 space-y-2">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary/80">Seller dashboard</p>
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">Create property</h1>
        <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
          New listings are submitted as pending and become public after approval.
        </p>
      </div>
      <PropertyForm submitLabel="Create property" onSubmit={handleSubmit} />
    </section>
  );
}
