"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";

import { LoadingButton } from "@/components/common/loading-button";
import { ImageUploadBox } from "@/components/property/image-upload-box";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import {
  propertySchema,
  type PropertyFormInput,
  type PropertyFormValues,
} from "@/lib/validations/property.schema";
import type { Property } from "@/types/property";

interface PropertyFormProps {
  initialProperty?: Property | null;
  submitLabel: string;
  onSubmit: (values: PropertyFormValues) => Promise<void>;
}

const fieldClassName = "mt-2 bg-background/90 shadow-sm shadow-black/5";

function parseImageUrls(value: unknown) {
  if (Array.isArray(value)) {
    return value.filter((item): item is string => typeof item === "string" && item.trim().length > 0);
  }

  if (typeof value !== "string") {
    return [];
  }

  return value
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
}

export function PropertyForm({ initialProperty, submitLabel, onSubmit }: PropertyFormProps) {
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<PropertyFormInput, unknown, PropertyFormValues>({
    resolver: zodResolver(propertySchema),
    defaultValues: {
      title: initialProperty?.title ?? "",
      description: initialProperty?.description ?? "",
      type: initialProperty?.type ?? "apartment",
      purpose: initialProperty?.purpose ?? "sale",
      price: initialProperty?.price ?? 0,
      area: initialProperty?.area ?? 0,
      bedrooms: initialProperty?.bedrooms ?? 0,
      bathrooms: initialProperty?.bathrooms ?? 0,
      address: initialProperty?.address ?? "",
      city: initialProperty?.city ?? "",
      district: initialProperty?.district ?? "",
      ward: initialProperty?.ward ?? "",
      latitude: initialProperty?.latitude ?? 10.7769,
      longitude: initialProperty?.longitude ?? 106.7009,
      images: initialProperty?.images ?? [],
      amenities: (initialProperty?.amenities ?? []).join(", "),
    },
  });
  const imageUrls = watch("images") ?? [];

  const handleValidSubmit = handleSubmit(async (values) => {
    setSubmitError(null);
    setSubmitSuccess(null);

    try {
      await onSubmit(values);
      setSubmitSuccess("Property saved successfully.");
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Failed to save property.");
    }
  });

  return (
    <form className="space-y-6 rounded-lg border border-border/70 bg-background/90 p-5 shadow-sm" onSubmit={handleValidSubmit}>
      <div className="grid gap-5 md:grid-cols-2">
        <div className="md:col-span-2">
          <Label htmlFor="title">Title</Label>
          <Input id="title" className={cn(fieldClassName, errors.title && "border-destructive")} {...register("title")} />
          {errors.title ? <p className="mt-2 text-sm text-destructive">{errors.title.message}</p> : null}
        </div>

        <div className="md:col-span-2">
          <Label htmlFor="description">Description</Label>
          <textarea
            id="description"
            rows={5}
            className={cn(
              "mt-2 flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none",
              errors.description && "border-destructive"
            )}
            {...register("description")}
          />
          {errors.description ? <p className="mt-2 text-sm text-destructive">{errors.description.message}</p> : null}
        </div>

        <div>
          <Label htmlFor="type">Type</Label>
          <select id="type" className={cn(fieldClassName, "flex h-10 w-full rounded-md border px-3 py-2 text-sm")} {...register("type")}>
            <option value="apartment">Apartment</option>
            <option value="house">House</option>
            <option value="land">Land</option>
            <option value="villa">Villa</option>
            <option value="office">Office</option>
          </select>
          {errors.type ? <p className="mt-2 text-sm text-destructive">{errors.type.message}</p> : null}
        </div>

        <div>
          <Label htmlFor="purpose">Purpose</Label>
          <select id="purpose" className={cn(fieldClassName, "flex h-10 w-full rounded-md border px-3 py-2 text-sm")} {...register("purpose")}>
            <option value="sale">Sale</option>
            <option value="rent">Rent</option>
          </select>
          {errors.purpose ? <p className="mt-2 text-sm text-destructive">{errors.purpose.message}</p> : null}
        </div>

        <div>
          <Label htmlFor="price">Price</Label>
          <Input id="price" type="number" min="1" className={cn(fieldClassName, errors.price && "border-destructive")} {...register("price")} />
          {errors.price ? <p className="mt-2 text-sm text-destructive">{errors.price.message}</p> : null}
        </div>

        <div>
          <Label htmlFor="area">Area</Label>
          <Input id="area" type="number" min="1" className={cn(fieldClassName, errors.area && "border-destructive")} {...register("area")} />
          {errors.area ? <p className="mt-2 text-sm text-destructive">{errors.area.message}</p> : null}
        </div>

        <div>
          <Label htmlFor="bedrooms">Bedrooms</Label>
          <Input id="bedrooms" type="number" min="0" className={fieldClassName} {...register("bedrooms")} />
          {errors.bedrooms ? <p className="mt-2 text-sm text-destructive">{errors.bedrooms.message}</p> : null}
        </div>

        <div>
          <Label htmlFor="bathrooms">Bathrooms</Label>
          <Input id="bathrooms" type="number" min="0" className={fieldClassName} {...register("bathrooms")} />
          {errors.bathrooms ? <p className="mt-2 text-sm text-destructive">{errors.bathrooms.message}</p> : null}
        </div>

        <div className="md:col-span-2">
          <Label htmlFor="address">Address</Label>
          <Input id="address" className={cn(fieldClassName, errors.address && "border-destructive")} {...register("address")} />
          {errors.address ? <p className="mt-2 text-sm text-destructive">{errors.address.message}</p> : null}
        </div>

        <div>
          <Label htmlFor="city">City</Label>
          <Input id="city" className={cn(fieldClassName, errors.city && "border-destructive")} {...register("city")} />
          {errors.city ? <p className="mt-2 text-sm text-destructive">{errors.city.message}</p> : null}
        </div>

        <div>
          <Label htmlFor="district">District</Label>
          <Input id="district" className={fieldClassName} {...register("district")} />
        </div>

        <div>
          <Label htmlFor="ward">Ward</Label>
          <Input id="ward" className={fieldClassName} {...register("ward")} />
        </div>

        <div>
          <Label htmlFor="latitude">Latitude</Label>
          <Input id="latitude" type="number" step="any" className={fieldClassName} {...register("latitude")} />
          {errors.latitude ? <p className="mt-2 text-sm text-destructive">{errors.latitude.message}</p> : null}
        </div>

        <div>
          <Label htmlFor="longitude">Longitude</Label>
          <Input id="longitude" type="number" step="any" className={fieldClassName} {...register("longitude")} />
          {errors.longitude ? <p className="mt-2 text-sm text-destructive">{errors.longitude.message}</p> : null}
        </div>

        <div className="md:col-span-2">
          <ImageUploadBox
            value={imageUrls}
            onChange={(urls) => setValue("images", urls, { shouldDirty: true, shouldValidate: true })}
            errorMessage={errors.images?.message}
          />
        </div>

        <div className="md:col-span-2">
          <Label htmlFor="amenities">Amenities</Label>
          <Input id="amenities" placeholder="Parking, Balcony, Security" className={fieldClassName} {...register("amenities")} />
          <p className="mt-2 text-xs text-muted-foreground">Optional. Separate multiple items with commas.</p>
        </div>
      </div>

      {submitError ? <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-900">{submitError}</div> : null}
      {submitSuccess ? <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">{submitSuccess}</div> : null}

      <div className="flex flex-wrap gap-3">
        <LoadingButton type="submit" loading={isSubmitting}>
          {submitLabel}
        </LoadingButton>
        <Button asChild type="button" variant="ghost">
          <Link href="/dashboard/properties">Cancel</Link>
        </Button>
      </div>
    </form>
  );
}
