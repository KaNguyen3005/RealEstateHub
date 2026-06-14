import type { ReactNode } from "react";
import { RoleGuard } from "@/components/auth/role-guard";
import { RoutePlaceholder } from "@/components/common/route-placeholder";

export default function AdminLayout({
  children
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <RoleGuard allowedRoles={["admin"]}>
      <div className="space-y-6">
        <RoutePlaceholder
          title="Admin"
          description="Nested admin layout created for Phase 5. Shared admin navigation will be added later."
        />
        <div>{children}</div>
      </div>
    </RoleGuard>
  );
}
