import type { ReactNode } from "react";
import { RoleGuard } from "@/components/auth/role-guard";

export default function DashboardLayout({
  children
}: Readonly<{
  children: ReactNode;
}>) {
  return <RoleGuard allowedRoles={["seller", "admin"]}>{children}</RoleGuard>;
}
