import type { ReactNode } from "react";
import { RoleGuard } from "@/components/auth/role-guard";
import { RoutePlaceholder } from "@/components/common/route-placeholder";

export default function DashboardLayout({
  children
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <RoleGuard allowedRoles={["seller", "admin"]}>
      <div className="space-y-6">
        <RoutePlaceholder
          title="Dashboard"
          description="Nested dashboard layout created for Phase 5. Shared seller navigation will be added later."
        />
        <div>{children}</div>
      </div>
    </RoleGuard>
  );
}
