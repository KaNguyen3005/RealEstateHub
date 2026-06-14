import { Bath, BedDouble, MapPin, Ruler } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { CompareButton } from "@/components/property/compare-button";
import { FavoriteButton } from "@/components/property/favorite-button";
import { PropertyStatusBadge } from "@/components/property/property-status-badge";
import {
  formatAddress,
  formatPrice,
  formatPropertyPurpose,
  formatPropertyType,
  isClosedProperty,
} from "@/lib/property-format";
import type { Property } from "@/types/property";

interface PropertyCardProps {
  property: Property;
}

export function PropertyCard({ property }: PropertyCardProps) {
  const coverImage = property.images[0] || "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=80";

  return (
    <article className="overflow-hidden rounded-lg border border-border/70 bg-background/90 shadow-sm shadow-black/5 transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/10">
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        <Link href={`/properties/${property._id}`} aria-label={`Xem chi tiết bài đăng ${property.title}`} className="group block h-full">
          <img
            src={coverImage}
            alt={property.title}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
          {isClosedProperty(property) ? (
            <div className="absolute inset-0 grid place-items-center bg-black/35 text-sm font-semibold uppercase tracking-[0.2em] text-white">
              {property.status}
            </div>
          ) : null}
        </Link>
        <div className="absolute left-3 top-3 flex gap-2">
          <PropertyStatusBadge status={property.status} />
          <span className="rounded-md bg-background/90 px-2.5 py-1 text-xs font-semibold text-foreground shadow-sm">
            {formatPropertyPurpose(property.purpose)}
          </span>
        </div>
      </div>

      <div className="space-y-4 p-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-3">
            <p className="text-lg font-semibold text-primary">{formatPrice(property.price, property.purpose)}</p>
            <span className="text-xs font-medium text-muted-foreground">{formatPropertyType(property.type)}</span>
          </div>
          <h2 className="line-clamp-2 text-lg font-semibold leading-snug text-foreground">{property.title}</h2>
          <p className="line-clamp-2 text-sm leading-6 text-muted-foreground">
            <MapPin className="mr-1 inline h-4 w-4 text-primary" />
            {formatAddress(property)}
          </p>
        </div>

        <div className="grid grid-cols-3 gap-2 rounded-lg bg-muted/40 p-3 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <Ruler className="h-4 w-4" />
            {property.area} m²
          </span>
          <span className="inline-flex items-center gap-1">
            <BedDouble className="h-4 w-4" />
            {property.bedrooms} PN
          </span>
          <span className="inline-flex items-center gap-1">
            <Bath className="h-4 w-4" />
            {property.bathrooms} WC
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button asChild size="sm" className="flex-1">
            <Link href={`/properties/${property._id}`}>Xem chi tiết</Link>
          </Button>
          <CompareButton propertyId={property._id} />
          <FavoriteButton propertyId={property._id} />
        </div>
      </div>
    </article>
  );
}