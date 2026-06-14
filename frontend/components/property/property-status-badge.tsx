import type { PropertyStatus } from "@/types/property";
import { cn } from "@/lib/utils";
import { formatPropertyStatus } from "@/lib/property-format";

const statusClassName: Record<PropertyStatus, string> = {
  approved: "border-emerald-200 bg-emerald-50 text-emerald-800",
  pending: "border-amber-200 bg-amber-50 text-amber-800",
  rejected: "border-red-200 bg-red-50 text-red-800",
  hidden: "border-slate-200 bg-slate-50 text-slate-700",
  sold: "border-zinc-300 bg-zinc-900 text-white",
  rented: "border-sky-200 bg-sky-50 text-sky-800",
};

interface PropertyStatusBadgeProps {
  status: PropertyStatus;
  className?: string;
}

export function PropertyStatusBadge({ status, className }: PropertyStatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border px-2.5 py-1 text-xs font-semibold",
        statusClassName[status],
        className
      )}
    >
      {formatPropertyStatus(status)}
    </span>
  );
}
