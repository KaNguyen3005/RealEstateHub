import type { ReactNode } from "react";
import { RoutePlaceholder } from "@/components/common/route-placeholder";

export default function AdminLayout({
  children
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <div className="space-y-6">
      <RoutePlaceholder
        title="Admin"
        description="Nested admin layout created for Phase 5. Shared admin navigation will be added later."
      />
      <div>{children}</div>
    </div>
  );
}
