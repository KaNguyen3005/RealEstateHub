import type { ReactNode } from "react";
import { RoutePlaceholder } from "@/components/common/route-placeholder";

export default function DashboardLayout({
  children
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <div className="space-y-6">
      <RoutePlaceholder
        title="Dashboard"
        description="Nested dashboard layout created for Phase 5. Shared seller navigation will be added later."
      />
      <div>{children}</div>
    </div>
  );
}
