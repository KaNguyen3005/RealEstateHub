"use client";

import { useMemo, useState } from "react";
import type { LucideIcon } from "lucide-react";
import {
  ChevronDown,
  Heart,
  LayoutDashboard,
  MessageSquare,
  Menu,
  Search,
  Shield,
  User,
  X
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { LogoutButton } from "@/components/auth/logout-button";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/authStore";
import { cn } from "@/lib/utils";

type UserRole = "user" | "seller" | "admin";
type AccountLink = {
  href: string;
  label: string;
  icon: LucideIcon;
};

interface NavbarProps {
  isAuthenticated?: boolean;
  userRole?: UserRole;
  className?: string;
}

const publicLinks = [
  { href: "/properties", label: "Properties" },
  { href: "/compare", label: "Compare" }
] as const;

const authenticatedLinks: AccountLink[] = [
  { href: "/profile", label: "Profile", icon: User },
  { href: "/favorites", label: "Favorites", icon: Heart },
  { href: "/chat", label: "Chat", icon: MessageSquare }
];

export function Navbar({
  isAuthenticated: isAuthenticatedProp = false,
  userRole = "user",
  className
}: NavbarProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const storeIsAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const storeUserRole = useAuthStore((state) => state.user?.role ?? "user");

  const isAuthenticated = storeIsAuthenticated || isAuthenticatedProp;
  const effectiveUserRole = isAuthenticated ? storeUserRole : userRole;

  const accountLinks = useMemo(() => {
    const links: AccountLink[] = [...authenticatedLinks];

    if (effectiveUserRole === "seller") {
      links.push({ href: "/dashboard", label: "Dashboard", icon: LayoutDashboard });
    }

    if (effectiveUserRole === "admin") {
      links.push({ href: "/admin", label: "Admin", icon: Shield });
    }

    return links;
  }, [effectiveUserRole]);

  const closeMobileMenu = () => setMobileOpen(false);

  return (
    <header className={cn("sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-xl", className)}>
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="group inline-flex items-center gap-3 font-semibold tracking-tight text-foreground"
          onClick={closeMobileMenu}
        >
          <span className="grid h-10 w-10 place-items-center rounded-2xl bg-primary text-sm font-bold text-primary-foreground shadow-sm transition-transform group-hover:scale-105">
            RH
          </span>
          <span className="text-lg">RealEstateHub</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Primary">
          {publicLinks.map((item) => (
            <Button
              key={item.href}
              asChild
              variant={pathname === item.href ? "secondary" : "ghost"}
              className="px-4"
            >
              <Link href={item.href}>{item.label}</Link>
            </Button>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          {!isAuthenticated ? (
            <>
              <Button asChild variant="ghost">
                <Link href="/login">Login</Link>
              </Button>
              <Button asChild>
                <Link href="/register">Register</Link>
              </Button>
            </>
          ) : (
            <details className="group relative">
              <summary className="list-none">
                <Button variant="outline">
                  Account
                  <ChevronDown className="h-4 w-4 transition-transform group-open:rotate-180" />
                </Button>
              </summary>
              <div className="absolute right-0 mt-3 w-56 rounded-2xl border border-border/70 bg-background p-2 shadow-lg shadow-black/5">
                <div className="px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  Menu
                </div>
                <div className="flex flex-col gap-1">
                  {accountLinks.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Button key={item.href} asChild variant="ghost" className="justify-start px-3">
                        <Link href={item.href}>
                          <Icon className="h-4 w-4" />
                          {item.label}
                        </Link>
                      </Button>
                    );
                  })}
                  <LogoutButton
                    className="justify-start px-3 text-destructive hover:text-destructive"
                    onLogoutStart={closeMobileMenu}
                  />
                </div>
              </div>
            </details>
          )}
        </div>

        <button
          type="button"
          className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-background text-foreground shadow-sm transition-colors hover:bg-accent md:hidden"
          onClick={() => setMobileOpen((value) => !value)}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      <div
        className={cn(
          "border-t border-border/60 bg-background/95 px-4 pb-4 pt-3 backdrop-blur-xl md:hidden",
          mobileOpen ? "block" : "hidden"
        )}
      >
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-3">
          <div className="flex items-center gap-2 rounded-2xl border border-border/70 bg-muted/30 px-4 py-3 text-sm text-muted-foreground">
            <Search className="h-4 w-4 text-primary" />
            Search, compare, and explore properties
          </div>

          <div className="flex flex-col gap-1">
            {publicLinks.map((item) => (
              <Button
                key={item.href}
                asChild
                variant={pathname === item.href ? "secondary" : "ghost"}
                className="justify-start px-4"
                onClick={closeMobileMenu}
              >
                <Link href={item.href}>{item.label}</Link>
              </Button>
            ))}
          </div>

          <div className="border-t border-border/70 pt-3">
            {!isAuthenticated ? (
              <div className="flex gap-2">
                <Button asChild variant="outline" className="flex-1" onClick={closeMobileMenu}>
                  <Link href="/login">Login</Link>
                </Button>
                <Button asChild className="flex-1" onClick={closeMobileMenu}>
                  <Link href="/register">Register</Link>
                </Button>
              </div>
            ) : (
              <div className="flex flex-col gap-1">
                {accountLinks.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Button
                      key={item.href}
                      asChild
                      variant="ghost"
                      className="justify-start px-4"
                      onClick={closeMobileMenu}
                    >
                      <Link href={item.href}>
                        <Icon className="h-4 w-4" />
                        {item.label}
                      </Link>
                    </Button>
                  );
                })}
                <LogoutButton
                  className="justify-start px-4 text-destructive hover:text-destructive"
                  onLogoutStart={closeMobileMenu}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
