import Link from "next/link";
import { Building2, Plus, Search } from "lucide-react";

import { Button } from "@/components/ui/button";

const dashboardActions = [
  {
    href: "/dashboard/properties",
    title: "My properties",
    description: "Review submitted listings, approval status, and seller actions.",
    icon: Building2,
    cta: "Manage listings",
  },
  {
    href: "/dashboard/properties/new",
    title: "New property",
    description: "Create a listing and submit it for admin approval.",
    icon: Plus,
    cta: "Create listing",
  },
  {
    href: "/properties",
    title: "Public marketplace",
    description: "Check how approved properties appear to buyers and renters.",
    icon: Search,
    cta: "View properties",
  },
];

export default function DashboardPage() {
  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="space-y-2">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary/80">Seller dashboard</p>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">Dashboard</h1>
          <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
            Manage listings from one focused workspace.
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/properties/new">
            <Plus className="h-4 w-4" />
            New property
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {dashboardActions.map((item) => {
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className="group rounded-lg border border-border/70 bg-background/90 p-5 shadow-sm transition-colors hover:border-primary/40 hover:bg-background"
            >
              <span className="grid h-11 w-11 place-items-center rounded-md bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <Icon className="h-5 w-5" />
              </span>
              <h2 className="mt-4 text-lg font-semibold tracking-tight text-foreground">{item.title}</h2>
              <p className="mt-2 min-h-12 text-sm leading-6 text-muted-foreground">{item.description}</p>
              <span className="mt-4 inline-flex text-sm font-medium text-primary">{item.cta}</span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
