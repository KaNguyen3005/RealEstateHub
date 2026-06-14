"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { MapPin, Search } from "lucide-react";

import { LoadingButton } from "@/components/common/loading-button";
import { ImageUploadBox } from "@/components/property/image-upload-box";
import { PropertyMap } from "@/components/property/property-map";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { geocodePropertyAddress } from "@/lib/geocoding";
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

function parseCoordinate(value: unknown) {
  const coordinate = Number(value);
  return Number.isFinite(coordinate) ? coordinate : undefined;
}

export function PropertyForm({ initialProperty, submitLabel, onSubmit }: PropertyFormProps) {
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [locationSuccess, setLocationSuccess] = useState<string | null>(null);
  const [isFindingLocation, setIsFindingLocation] = useState(false);
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
      latitude: initialProperty?.latitude,
      longitude: initialProperty?.longitude,
      images: initialProperty?.images ?? [],
      amenities: (initialProperty?.amenities ?? []).join(", "),
    },
  });
  const imageUrls = watch("images") ?? [];
  const address = watch("address");
  const city = watch("city");
  const district = watch("district");
  const ward = watch("ward");
  const latitude = parseCoordinate(watch("latitude"));
  const longitude = parseCoordinate(watch("longitude"));
  const selectedLocation =
    typeof latitude === "number" && typeof longitude === "number"
      ? {
          latitude,
          longitude,
        }
      : undefined;

  const updateLocation = (location: { latitude: number; longitude: number }) => {
    setValue("latitude", location.latitude, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
    setValue("longitude", location.longitude, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
  };

  const handleFindLocation = async () => {
    setLocationError(null);
    setLocationSuccess(null);
    setIsFindingLocation(true);

    try {
      const result = await geocodePropertyAddress({
        address,
        city,
        district,
        ward,
      });

      updateLocation({
        latitude: result.latitude,
        longitude: result.longitude,
      });
      setLocationSuccess(result.label);
    } catch (error) {
      setLocationError(error instanceof Error ? error.message : "Location lookup failed.");
    } finally {
      setIsFindingLocation(false);
    }
  };

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

        <div className="md:col-span-2">
          <input type="hidden" {...register("latitude")} />
          <input type="hidden" {...register("longitude")} />

          <div className="rounded-lg border border-border/70 bg-muted/20 p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <Label>Property location</Label>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">
                  Find the location from the address, then click the map if the marker needs adjustment.
                </p>
              </div>
              <Button type="button" variant="outline" onClick={handleFindLocation} disabled={isFindingLocation}>
                {isFindingLocation ? (
                  <>
                    <Search className="h-4 w-4 animate-pulse" />
                    Finding...
                  </>
                ) : (
                  <>
                    <MapPin className="h-4 w-4" />
                    Find location
                  </>
                )}
              </Button>
            </div>

            <div className="mt-4">
              <PropertyMap
                selectable
                selectedLocation={selectedLocation}
                center={selectedLocation}
                zoom={selectedLocation ? 15 : 11}
                className="border-border/70"
                onLocationSelect={(location) => {
                  updateLocation(location);
                  setLocationError(null);
                  setLocationSuccess("Location selected from the map.");
                }}
              />
            </div>

            <div className="mt-3 space-y-1 text-sm">
              {selectedLocation ? (
                <p className="text-muted-foreground">
                  Selected coordinates: {selectedLocation.latitude.toFixed(6)}, {selectedLocation.longitude.toFixed(6)}
                </p>
              ) : (
                <p className="text-muted-foreground">No location selected yet.</p>
              )}
              {locationSuccess ? <p className="text-emerald-700">{locationSuccess}</p> : null}
              {locationError ? <p className="text-destructive">{locationError}</p> : null}
              {errors.latitude ? <p className="text-destructive">{errors.latitude.message}</p> : null}
              {errors.longitude ? <p className="text-destructive">{errors.longitude.message}</p> : null}
            </div>
          </div>
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
