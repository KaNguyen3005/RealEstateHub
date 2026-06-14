import type { AdminContactRequest } from "@/types/admin";

interface ContactRequestTableProps {
  requests: AdminContactRequest[];
}

function getPropertyTitle(request: AdminContactRequest) {
  return typeof request.propertyId === "object" && request.propertyId ? request.propertyId.title : "Property";
}

function getRequesterLabel(request: AdminContactRequest) {
  if (typeof request.userId === "object" && request.userId) {
    return `${request.name} (${request.userId.role})`;
  }

  return `${request.name} (guest)`;
}

export function ContactRequestTable({ requests }: ContactRequestTableProps) {
  return (
    <div className="overflow-hidden rounded-lg border border-border/70 bg-background/90 shadow-sm">
      <div className="hidden grid-cols-[1fr_1fr_1.5fr_0.5fr_0.7fr] border-b border-border/70 bg-muted/40 px-4 py-3 text-sm font-semibold text-muted-foreground lg:grid">
        <span>Requester</span>
        <span>Property</span>
        <span>Message</span>
        <span>Status</span>
        <span>Date</span>
      </div>
      <div className="divide-y divide-border/70">
        {requests.map((request) => (
          <div key={request._id} className="grid gap-3 px-4 py-4 lg:grid-cols-[1fr_1fr_1.5fr_0.5fr_0.7fr] lg:items-start">
            <div>
              <p className="font-semibold text-foreground">{getRequesterLabel(request)}</p>
              <p className="mt-1 text-sm text-muted-foreground">{request.email}</p>
              <p className="text-sm text-muted-foreground">{request.phone}</p>
            </div>
            <p className="text-sm font-medium text-foreground">{getPropertyTitle(request)}</p>
            <p className="line-clamp-3 text-sm leading-6 text-muted-foreground">{request.message}</p>
            <span className="text-sm font-medium text-primary">{request.status}</span>
            <p className="text-sm text-muted-foreground">{new Date(request.createdAt).toLocaleDateString("vi-VN")}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
