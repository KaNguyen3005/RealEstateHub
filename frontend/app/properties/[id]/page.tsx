import { notFound } from "next/navigation";
import Link from "next/link";
import { Bath, BedDouble, MapPin, Ruler, UserRound } from "lucide-react";

import { ContactRequestForm } from "@/components/property/contact-request-form";
import { CompareButton } from "@/components/property/compare-button";
import { FavoriteButton } from "@/components/property/favorite-button";
import { PropertyGallery } from "@/components/property/property-gallery";
import { PropertyMap } from "@/components/property/property-map";
import { PropertyStatusBadge } from "@/components/property/property-status-badge";
import { StartChatButton } from "@/components/property/start-chat-button";
import { Button } from "@/components/ui/button";
import {
  formatAddress,
  formatPrice,
  formatPropertyPurpose,
  formatPropertyType,
  isClosedProperty,
} from "@/lib/property-format";
import { getPropertyById } from "@/lib/properties";
import type { User } from "@/types/user";

interface PropertyDetailPageProps {
  params: {
    id: string;
  };
}

function getOwnerName(ownerId: unknown) {
  if (ownerId && typeof ownerId === "object" && "fullName" in ownerId) {
    return (ownerId as Pick<User, "fullName">).fullName;
  }

  return "Property seller";
}

export default async function PropertyDetailPage({ params }: PropertyDetailPageProps) {
  const property = await getPropertyById(params.id).catch(() => null);

  if (!property) {
    notFound();
  }

  const isClosed = isClosedProperty(property);

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-6">
        <Button asChild variant="ghost">
          <Link href="/properties">Back to properties</Link>
        </Button>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1.35fr_0.85fr]">
        <PropertyGallery title={property.title} images={property.images} />

        <aside className="space-y-5 rounded-lg border border-border/70 bg-background/90 p-5 shadow-sm">
          <div className="flex flex-wrap items-center gap-2">
            <PropertyStatusBadge status={property.status} />
            <span className="rounded-md bg-muted px-2.5 py-1 text-xs font-semibold text-muted-foreground">
              {formatPropertyPurpose(property.purpose)}
            </span>
            <span className="rounded-md bg-muted px-2.5 py-1 text-xs font-semibold text-muted-foreground">
              {formatPropertyType(property.type)}
            </span>
          </div>

          <div className="space-y-3">
            <h1 className="text-3xl font-semibold tracking-tight text-foreground">{property.title}</h1>
            <p className="text-2xl font-semibold text-primary">{formatPrice(property.price, property.purpose)}</p>
            <p className="text-sm leading-6 text-muted-foreground">
              <MapPin className="mr-1 inline h-4 w-4 text-primary" />
              {formatAddress(property)}
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 rounded-lg bg-muted/40 p-4 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-2">
              <Ruler className="h-4 w-4" />
              {property.area} m2
            </span>
            <span className="inline-flex items-center gap-2">
              <BedDouble className="h-4 w-4" />
              {property.bedrooms}
            </span>
            <span className="inline-flex items-center gap-2">
              <Bath className="h-4 w-4" />
              {property.bathrooms}
            </span>
          </div>

          <div className="space-y-2 rounded-lg border border-border/70 p-4">
            <p className="inline-flex items-center gap-2 text-sm font-semibold text-foreground">
              <UserRound className="h-4 w-4 text-primary" />
              {getOwnerName(property.ownerId)}
            </p>
            <p className="text-sm text-muted-foreground">Send a request and the seller can follow up with you directly.</p>
          </div>

          <div className="flex flex-wrap gap-2">
            <CompareButton propertyId={property._id} />
            <FavoriteButton propertyId={property._id} />
            <Button asChild disabled={isClosed}>
              <a href="#contact-request">{isClosed ? "Unavailable" : "Contact seller"}</a>
            </Button>
            <StartChatButton propertyId={property._id} disabled={isClosed} />
          </div>
        </aside>
      </div>

      <div id="contact-request" className="mt-8 scroll-mt-24">
        {isClosed ? (
          <div className="rounded-lg border border-border/70 bg-muted/30 p-5 text-sm text-muted-foreground">
            This property is no longer available for contact requests.
          </div>
        ) : (
          <ContactRequestForm propertyId={property._id} />
        )}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_0.55fr]">
        <article className="rounded-lg border border-border/70 bg-background/90 p-5 shadow-sm">
          <h2 className="text-xl font-semibold text-foreground">Description</h2>
          <p className="mt-3 whitespace-pre-line text-sm leading-7 text-muted-foreground">{property.description}</p>
        </article>

        <div className="space-y-6">
          <article className="rounded-lg border border-border/70 bg-background/90 p-5 shadow-sm">
            <h2 className="text-xl font-semibold text-foreground">Amenities</h2>
            {property.amenities.length > 0 ? (
              <div className="mt-3 flex flex-wrap gap-2">
                {property.amenities.map((amenity) => (
                  <span key={amenity} className="rounded-md bg-muted px-3 py-1.5 text-sm text-muted-foreground">
                    {amenity}
                  </span>
                ))}
              </div>
            ) : (
              <p className="mt-3 text-sm text-muted-foreground">No amenities listed.</p>
            )}
          </article>

          <PropertyMap property={property} center={{ latitude: property.latitude, longitude: property.longitude }} zoom={15} />
        </div>
      </div>
    </section>
  );
}
