"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, ClipboardList, Home, Mail, Users } from "lucide-react";

import { cn } from "@/lib/utils";

const adminLinks = [
  { href: "/admin", label: "Tổng quan", icon: BarChart3 },
  { href: "/admin/users", label: "Người dùng", icon: Users },
  { href: "/admin/properties", label: "Bất động sản", icon: Home },
  { href: "/admin/contact-requests", label: "Yêu cầu", icon: Mail },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-2">
          <p className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-primary/80">
            <ClipboardList className="h-4 w-4" />
            Quản trị viên
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">Trung tâm điều khiển</h1>
          <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
            Theo dõi hoạt động hệ thống, kiểm duyệt tin đăng, quản lý các tài khoản và xử lý yêu cầu liên hệ.
          </p>
        </div>

        <nav className="flex flex-wrap gap-2">
          {adminLinks.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "inline-flex items-center gap-2 rounded-md border border-border bg-background px-3 py-2 text-sm font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground",
                  isActive && "border-primary/40 bg-primary/10 text-primary"
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      {children}
    </section>
  );
}