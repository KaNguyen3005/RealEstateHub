import type { ReactNode } from "react";

export default function DashboardPropertiesLayout({
  children
}: Readonly<{
  children: ReactNode;
}>) {
  return <section className="space-y-6">{children}</section>;
}
