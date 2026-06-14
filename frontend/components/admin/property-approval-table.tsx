"use client";

import Link from "next/link";
import { useState } from "react";

import { PropertyStatusBadge } from "@/components/property/property-status-badge";
import { Button } from "@/components/ui/button";
import { formatAddress, formatPrice } from "@/lib/property-format";
import type { Property } from "@/types/property";

interface PropertyApprovalTableProps {
  properties: Property[];
  onModerate: (propertyId: string, action: "approve" | "reject" | "hide") => Promise<void>;
}

export function PropertyApprovalTable({ properties, onModerate }: PropertyApprovalTableProps) {
  const [busyPropertyId, setBusyPropertyId] = useState<string | null>(null);

  const runAction = async (propertyId: string, action: "approve" | "reject" | "hide") => {
    setBusyPropertyId(propertyId);

    try {
      await onModerate(propertyId, action);
    } finally {
      setBusyPropertyId(null);
    }
  };

  return (
    <div className="overflow-hidden rounded-lg border border-border/70 bg-background/90 shadow-sm">
      <div className="hidden grid-cols-[1.3fr_0.7fr_0.5fr_1fr] border-b border-border/70 bg-muted/40 px-4 py-3 text-sm font-semibold text-muted-foreground lg:grid">
        <span>Property</span>
        <span>Price</span>
        <span>Status</span>
        <span className="text-right">Actions</span>
      </div>
      <div className="divide-y divide-border/70">
        {properties.map((property) => (
          <div key={property._id} className="grid gap-3 px-4 py-4 lg:grid-cols-[1.3fr_0.7fr_0.5fr_1fr] lg:items-center">
            <div>
              <Link href={`/properties/${property._id}`} className="font-semibold text-foreground hover:text-primary">
                {property.title}
              </Link>
              <p className="mt-1 line-clamp-1 text-sm text-muted-foreground">{formatAddress(property)}</p>
            </div>
            <p className="text-sm font-medium text-foreground">{formatPrice(property.price, property.purpose)}</p>
            <PropertyStatusBadge status={property.status} />
            <div className="flex flex-wrap justify-start gap-2 lg:justify-end">
              <Button size="sm" disabled={busyPropertyId === property._id} onClick={() => runAction(property._id, "approve")}>
                Approve
              </Button>
              <Button size="sm" variant="outline" disabled={busyPropertyId === property._id} onClick={() => runAction(property._id, "reject")}>
                Reject
              </Button>
              <Button size="sm" variant="ghost" disabled={busyPropertyId === property._id} onClick={() => runAction(property._id, "hide")}>
                Hide
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
