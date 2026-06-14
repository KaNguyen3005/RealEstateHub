"use client";

import dynamic from "next/dynamic";

import { cn } from "@/lib/utils";
import type { Property } from "@/types/property";

export interface PropertyMapProps {
  properties?: Property[];
  center?: {
    latitude: number;
    longitude: number;
  };
  property?: Property;
  zoom?: number;
  className?: string;
}

const LeafletPropertyMap = dynamic(() => import("@/components/property/property-map-leaflet"), {
  ssr: false,
  loading: () => (
    <div className="grid min-h-[320px] place-items-center rounded-lg border border-border bg-muted/40 text-sm text-muted-foreground">
      Loading map...
    </div>
  ),
});

function hasValidCoordinates(latitude?: number, longitude?: number) {
  return Number.isFinite(latitude) && Number.isFinite(longitude);
}

export function PropertyMap({ properties = [], center, property, zoom = 13, className }: PropertyMapProps) {
  const markerProperties = property ? [property] : properties;
  const hasMarkers = markerProperties.some((item) => hasValidCoordinates(item.latitude, item.longitude));
  const hasCenter = hasValidCoordinates(center?.latitude, center?.longitude);

  if (!hasMarkers && !hasCenter) {
    return (
      <div className={cn("rounded-lg border border-border bg-muted/30 p-5 text-sm leading-6 text-muted-foreground", className)}>
        Map is unavailable because this property does not have coordinates yet.
      </div>
    );
  }

  return (
    <div className={cn("overflow-hidden rounded-lg border border-border bg-background shadow-sm", className)}>
      <LeafletPropertyMap properties={markerProperties} center={center} zoom={zoom} />
    </div>
  );
}
