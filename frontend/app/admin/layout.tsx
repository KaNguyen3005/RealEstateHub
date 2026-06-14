import type { ReactNode } from "react";

import { RoleGuard } from "@/components/auth/role-guard";
import { AdminShell } from "@/components/admin/admin-shell";

export default function AdminLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <RoleGuard allowedRoles={["admin"]}>
      <AdminShell>{children}</AdminShell>
    </RoleGuard>
  );
}
