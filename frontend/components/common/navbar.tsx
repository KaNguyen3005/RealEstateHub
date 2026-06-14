"use client";

import { useEffect, useMemo, useRef, useState } from "react";
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
  { href: "/properties", label: "Bất động sản" },
  { href: "/compare", label: "So sánh" }
] as const;

const authenticatedLinks: AccountLink[] = [
  { href: "/profile", label: "Trang cá nhân", icon: User },
  { href: "/chat", label: "Trò chuyện", icon: MessageSquare }
];

const mobileAuthenticatedLinks: AccountLink[] = [
  { href: "/profile", label: "Trang cá nhân", icon: User },
  { href: "/favorites", label: "Tin yêu thích", icon: Heart },
  { href: "/chat", label: "Trò chuyện", icon: MessageSquare }
];

function getRoleLabel(role: UserRole): string {
  switch (role) {
    case "admin":
      return "Quản trị viên";
    case "seller":
      return "Người môi giới / Người bán";
    default:
      return "Khách hàng";
  }
}

export function Navbar({
  isAuthenticated: isAuthenticatedProp = false,
  userRole = "user",
  className
}: NavbarProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const accountMenuRef = useRef<HTMLDivElement | null>(null);
  const storeIsAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const storeUser = useAuthStore((state) => state.user);
  const storeUserRole = useAuthStore((state) => state.user?.role ?? "user");
  const authStatus = useAuthStore((state) => state.status);

  const isResolvingAuth = authStatus === "bootstrapping";
  const isAuthenticated = (authStatus === "authenticated" && storeIsAuthenticated) || isAuthenticatedProp;
  const effectiveUserRole = isAuthenticated ? storeUserRole : userRole;
  const displayName = storeUser?.fullName || storeUser?.email || "Tài khoản";
  const userInitials =
    displayName
      .split(" ")
      .filter(Boolean)
      .slice(-2) // Lấy chữ cái của Họ & Tên trong tiếng Việt chuẩn hơn
      .map((part) => part[0]?.toUpperCase())
      .join("") || "TK";
  const closeMobileMenu = () => setMobileOpen(false);

  const resolvingDesktopActions = (
    <div className="flex items-center gap-2" aria-label="Đang kiểm tra phiên đăng nhập">
      <div className="h-10 w-20 animate-pulse rounded-md border border-border/70 bg-muted/50" />
      <div className="h-10 w-24 animate-pulse rounded-md bg-muted/60" />
    </div>
  );

  const guestDesktopActions = (
    <>
      <Button asChild variant="ghost">
        <Link href="/login">Đăng nhập</Link>
      </Button>
      <Button asChild>
        <Link href="/register">Đăng ký</Link>
      </Button>
    </>
  );

  const resolvingMobileActions = (
    <div className="flex gap-2" aria-label="Đang kiểm tra phiên đăng nhập">
      <div className="h-10 flex-1 animate-pulse rounded-md border border-border/70 bg-muted/50" />
      <div className="h-10 flex-1 animate-pulse rounded-md bg-muted/60" />
    </div>
  );

  const guestMobileActions = (
    <div className="flex gap-2">
      <Button
        asChild
        variant="outline"
        className="flex-1"
        onClick={closeMobileMenu}
      >
        <Link href="/login">Đăng nhập</Link>
      </Button>
      <Button asChild className="flex-1" onClick={closeMobileMenu}>
        <Link href="/register">Đăng ký</Link>
      </Button>
    </div>
  );

  const accountLinks = useMemo(() => {
    return authenticatedLinks;
  }, []);

  const mobileAccountLinks = useMemo(() => {
    const links: AccountLink[] = [...mobileAuthenticatedLinks];

    if (effectiveUserRole === "seller") {
      links.push({ href: "/dashboard", label: "Trang quản lý", icon: LayoutDashboard });
    }

    if (effectiveUserRole === "admin") {
      links.push({ href: "/admin", label: "Quản trị hệ thống", icon: Shield });
    }

    return links;
  }, [effectiveUserRole]);

  const managementLink = useMemo<AccountLink | null>(() => {
    if (effectiveUserRole === "seller") {
      return { href: "/dashboard", label: "Trang quản lý", icon: LayoutDashboard };
    }

    if (effectiveUserRole === "admin") {
      return { href: "/admin", label: "Quản trị", icon: Shield };
    }

    return null;
  }, [effectiveUserRole]);

  const isActivePath = (href: string) => pathname === href || pathname.startsWith(`${href}/`);
  const ManagementIcon = managementLink?.icon;

  useEffect(() => {
    setAccountOpen(false);
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!accountOpen) {
      return;
    }

    const handlePointerDown = (event: PointerEvent) => {
      if (!accountMenuRef.current?.contains(event.target as Node)) {
        setAccountOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setAccountOpen(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [accountOpen]);

  const desktopAuthActions = isResolvingAuth ? (
    resolvingDesktopActions
  ) : isAuthenticated ? (
    <div className="flex items-center gap-2">
      {managementLink ? (
        <Button
          asChild
          variant={isActivePath(managementLink.href) ? "secondary" : "ghost"}
          className="h-11 rounded-lg px-3"
        >
          <Link href={managementLink.href}>
            {ManagementIcon ? <ManagementIcon className="h-4 w-4" /> : null}
            {managementLink.label}
          </Link>
        </Button>
      ) : null}

      <Button
        asChild
        variant={isActivePath("/favorites") ? "secondary" : "ghost"}
        className="h-11 rounded-lg px-3"
      >
        <Link href="/favorites">
          <Heart className="h-4 w-4" />
          Yêu thích
        </Link>
      </Button>

      <div ref={accountMenuRef} className="relative">
        <Button
          type="button"
          variant="outline"
          className="h-11 gap-3 rounded-lg border-border/80 bg-background/90 px-3 shadow-sm"
          aria-expanded={accountOpen}
          aria-haspopup="menu"
          onClick={() => setAccountOpen((isOpen) => !isOpen)}
        >
          <span className="grid h-8 w-8 place-items-center rounded-md bg-primary text-xs font-semibold text-primary-foreground">
            {userInitials}
          </span>
          <span className="hidden max-w-36 truncate text-left text-sm font-medium lg:inline">
            {displayName}
          </span>
          <ChevronDown className={cn("h-4 w-4 text-muted-foreground transition-transform", accountOpen && "rotate-180")} />
        </Button>

        {accountOpen ? (
          <div
            role="menu"
            className="absolute right-0 z-50 mt-3 w-64 rounded-lg border border-border/70 bg-background p-2 shadow-xl shadow-black/10"
          >
            <div className="flex items-center gap-3 rounded-md bg-muted/40 px-3 py-3">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-md bg-primary text-xs font-semibold text-primary-foreground">
                {userInitials}
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-foreground">{displayName}</p>
                <p className="text-xs text-muted-foreground">{getRoleLabel(effectiveUserRole)}</p>
              </div>
            </div>

            <div className="mt-2 flex flex-col gap-1">
              {accountLinks.map((item) => {
                const Icon = item.icon;
                return (
                  <Button key={item.href} asChild variant="ghost" className="h-10 justify-start rounded-md px-3">
                    <Link href={item.href} role="menuitem" onClick={() => setAccountOpen(false)}>
                      <Icon className="h-4 w-4 text-muted-foreground" />
                      {item.label}
                    </Link>
                  </Button>
                );
              })}
              <div className="my-1 border-t border-border/70" />
              <LogoutButton
                className="h-10 justify-start rounded-md px-3 text-destructive hover:text-destructive"
                onLogoutStart={() => setAccountOpen(false)}
              />
            </div>
          </div>
        ) : null}
      </div>
    </div>
  ) : (
    guestDesktopActions
  );

  const mobileAuthActions = isResolvingAuth ? (
    resolvingMobileActions
  ) : isAuthenticated ? (
    <div className="flex flex-col gap-1">
      <div className="mb-2 flex items-center gap-3 rounded-lg border border-border/70 bg-muted/30 px-4 py-3">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-primary text-xs font-semibold text-primary-foreground">
          {userInitials}
        </span>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-foreground">{displayName}</p>
          <p className="text-xs text-muted-foreground">{getRoleLabel(effectiveUserRole)}</p>
        </div>
      </div>
      {mobileAccountLinks.map((item) => {
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
      <div className="mt-2 border-t border-border/70 pt-2">
        <LogoutButton
          className="w-full justify-start px-4 text-destructive hover:text-destructive"
          onLogoutStart={closeMobileMenu}
        />
      </div>
    </div>
  ) : (
    guestMobileActions
  );

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

        <nav className="hidden items-center gap-1 md:flex" aria-label="Menu chính">
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
          {desktopAuthActions}
        </div>

        <button
          type="button"
          className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-background text-foreground shadow-sm transition-colors hover:bg-accent md:hidden"
          onClick={() => setMobileOpen((value) => !value)}
          aria-label={mobileOpen ? "Đóng menu" : "Mở menu"}
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
            Tìm kiếm, so sánh và khám phá nhà đất
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
            {mobileAuthActions}
          </div>
        </div>
      </div>
    </header>
  );
}