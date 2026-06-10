import type { ReactNode } from "react";

import { Footer } from "@/components/common/footer";
import { Navbar } from "@/components/common/navbar";
import { cn } from "@/lib/utils";

interface SiteShellProps {
  children: ReactNode;
  className?: string;
}

export function SiteShell({ children, className }: SiteShellProps) {
  return (
    <div
      className={cn(
        "relative flex min-h-screen flex-col overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(154,95,45,0.16),_transparent_35%),linear-gradient(180deg,_var(--bg)_0%,_var(--bg-accent)_100%)]",
        className
      )}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[28rem] bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.7),_transparent_60%)]" />
      <div className="pointer-events-none absolute inset-y-0 right-0 -z-10 w-[22rem] bg-[linear-gradient(180deg,_rgba(255,255,255,0.18),_transparent)]" />
      <Navbar />
      <main className="relative z-10 flex-1">{children}</main>
      <Footer />
    </div>
  );
}
