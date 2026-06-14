import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  BadgeCheck,
  Building2,
  Heart,
  Home,
  MapPin,
  MessageCircle,
  Search,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import Link from "next/link";

import { PropertyCard } from "@/components/property/property-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getProperties } from "@/lib/properties";

type Highlight = {
  title: string;
  description: string;
  icon: LucideIcon;
};

const quickSearches = [
  { label: "Homes for sale", href: "/properties?purpose=sale", tone: "bg-blue-50 text-blue-700" },
  { label: "Rentals", href: "/properties?purpose=rent", tone: "bg-emerald-50 text-emerald-700" },
  { label: "Apartments", href: "/properties?type=apartment", tone: "bg-amber-50 text-amber-700" },
  { label: "Villas", href: "/properties?type=villa", tone: "bg-slate-100 text-slate-700" },
] as const;

const highlights: Highlight[] = [
  {
    title: "Search with clarity",
    description: "Filter by location, type, purpose, price, and area so every visit starts with useful results.",
    icon: Search,
  },
  {
    title: "Compare smarter",
    description: "Shortlist and compare homes side by side before making a high-value decision.",
    icon: BadgeCheck,
  },
  {
    title: "Contact in fewer steps",
    description: "Send contact requests or open realtime chat when a listing looks right.",
    icon: MessageCircle,
  },
  {
    title: "Managed listings",
    description: "Admin approval keeps the marketplace cleaner, safer, and easier to trust.",
    icon: ShieldCheck,
  },
];

const roleCards = [
  {
    title: "For buyers and renters",
    description: "Browse approved listings, save favorites, compare properties, and contact sellers quickly.",
    icon: Heart,
  },
  {
    title: "For sellers",
    description: "Create property posts, upload images, pin locations, and manage listing status from the dashboard.",
    icon: Building2,
  },
  {
    title: "For admins",
    description: "Review pending listings, moderate platform activity, and manage users from one dashboard.",
    icon: ShieldCheck,
  },
] satisfies Highlight[];

export default async function HomePage() {
  let featuredData;
  let featuredError: string | null = null;

  try {
    featuredData = await getProperties({ limit: "3" });
  } catch (error) {
    featuredError = error instanceof Error ? error.message : "Featured properties could not load.";
    featuredData = {
      items: [],
      page: 1,
      limit: 3,
      totalItems: 0,
      totalPages: 1,
    };
  }

  const featuredProperties = featuredData.items.slice(0, 3);
  const totalProperties = featuredData.totalItems;

  return (
    <main className="overflow-hidden bg-[radial-gradient(circle_at_top_left,rgba(37,99,235,0.10),transparent_32%),linear-gradient(180deg,#ffffff_0%,#f8fafc_48%,#ffffff_100%)]">
      <section className="mx-auto grid w-full max-w-7xl gap-12 px-4 py-12 sm:px-6 md:py-16 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-20">
        <div className="flex flex-col justify-center">
          <div className="mb-6 inline-flex w-fit items-center gap-2 rounded-full border border-blue-100 bg-white/80 px-4 py-2 text-sm font-semibold text-blue-700 shadow-sm">
            <Sparkles className="h-4 w-4" />
            Trusted property discovery for modern buyers
          </div>

          <div className="space-y-6">
            <h1 className="max-w-4xl text-4xl font-semibold tracking-[-0.04em] text-slate-950 sm:text-5xl lg:text-6xl">
              Find the right property with confidence.
            </h1>
            <p className="max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
              RealEstateHub helps buyers, renters, and sellers search, compare, favorite, and connect around verified
              property listings in one focused marketplace.
            </p>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg" className="h-12 rounded-xl px-6">
              <Link href="/properties">
                Browse properties
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="h-12 rounded-xl border-slate-300 bg-white/80 px-6">
              <Link href="/dashboard/properties/new">List a property</Link>
            </Button>
          </div>

          <dl className="mt-10 grid max-w-2xl grid-cols-3 gap-3">
            <div className="rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm">
              <dt className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">Listings</dt>
              <dd className="mt-2 text-2xl font-semibold text-slate-950">{totalProperties}+</dd>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm">
              <dt className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">Actions</dt>
              <dd className="mt-2 text-2xl font-semibold text-slate-950">4-in-1</dd>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm">
              <dt className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">Access</dt>
              <dd className="mt-2 text-2xl font-semibold text-slate-950">24/7</dd>
            </div>
          </dl>
        </div>

        <div className="relative">
          <div className="absolute -right-10 top-8 h-56 w-56 rounded-full bg-blue-200/40 blur-3xl" />
          <div className="absolute -bottom-8 -left-8 h-64 w-64 rounded-full bg-amber-200/40 blur-3xl" />

          <div className="relative rounded-[2rem] border border-slate-200 bg-white/90 p-4 shadow-2xl shadow-slate-900/10 backdrop-blur">
            <div className="overflow-hidden rounded-[1.5rem] bg-slate-950 text-white">
              <div className="grid min-h-[360px] content-between bg-[linear-gradient(135deg,rgba(15,23,42,0.96),rgba(30,64,175,0.82)),radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.22),transparent_25%)] p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium text-blue-100">Featured marketplace</p>
                    <h2 className="mt-2 max-w-xs text-3xl font-semibold tracking-tight">Search by location, budget, and lifestyle.</h2>
                  </div>
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-white/15">
                    <Home className="h-6 w-6" />
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-sm text-blue-100">Modern apartment</p>
                        <p className="mt-1 text-xl font-semibold">Downtown living, ready to move</p>
                      </div>
                      <span className="rounded-full bg-emerald-400/20 px-3 py-1 text-sm font-semibold text-emerald-100">
                        Approved
                      </span>
                    </div>
                    <div className="mt-4 grid grid-cols-3 gap-3 text-sm text-blue-100">
                      <span>92 m2</span>
                      <span>2 beds</span>
                      <span>For sale</span>
                    </div>
                  </div>

                  <form action="/properties" method="get" className="rounded-2xl bg-white p-3 text-slate-950 shadow-xl">
                    <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
                      <div className="relative">
                        <MapPin className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                        <Input name="city" placeholder="Try Ha Noi or Ho Chi Minh" className="h-12 rounded-xl pl-9" />
                      </div>
                      <Button type="submit" className="h-12 rounded-xl px-5">
                        Search
                      </Button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto -mt-4 w-full max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
        <form action="/properties" method="get" className="rounded-3xl border border-slate-200 bg-white p-4 shadow-xl shadow-slate-900/5">
          <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr_1fr_1fr_auto]">
            <div className="space-y-2">
              <label htmlFor="home-keyword" className="text-sm font-semibold text-slate-800">
                What are you looking for?
              </label>
              <Input id="home-keyword" name="keyword" placeholder="Title, address, description" className="h-12 rounded-xl" />
            </div>

            <div className="space-y-2">
              <label htmlFor="home-city" className="text-sm font-semibold text-slate-800">
                City
              </label>
              <Input id="home-city" name="city" placeholder="Ha Noi" className="h-12 rounded-xl" />
            </div>

            <div className="space-y-2">
              <label htmlFor="home-purpose" className="text-sm font-semibold text-slate-800">
                Purpose
              </label>
              <select
                id="home-purpose"
                name="purpose"
                className="flex h-12 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <option value="">Any purpose</option>
                <option value="sale">For sale</option>
                <option value="rent">For rent</option>
              </select>
            </div>

            <div className="space-y-2">
              <label htmlFor="home-type" className="text-sm font-semibold text-slate-800">
                Type
              </label>
              <select
                id="home-type"
                name="type"
                className="flex h-12 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <option value="">Any type</option>
                <option value="apartment">Apartment</option>
                <option value="house">House</option>
                <option value="land">Land</option>
                <option value="villa">Villa</option>
                <option value="office">Office</option>
              </select>
            </div>

            <div className="flex items-end">
              <Button type="submit" className="h-12 w-full rounded-xl px-6">
                <Search className="h-4 w-4" />
                Search
              </Button>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {quickSearches.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition hover:-translate-y-0.5 ${item.tone}`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </form>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary/80">Featured listings</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">Start with recently approved homes</h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
              Explore a quick preview of available properties, then open the full listing page for advanced filters.
            </p>
          </div>
          <Button asChild variant="outline" className="rounded-xl">
            <Link href="/properties">
              View all properties
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        {featuredError ? (
          <div className="rounded-3xl border border-amber-200 bg-amber-50 p-6 text-amber-900">
            <p className="font-semibold">Featured properties are temporarily unavailable.</p>
            <p className="mt-2 text-sm leading-6">
              {featuredError} Start the backend or configure `NEXT_PUBLIC_API_URL`, then refresh this page.
            </p>
          </div>
        ) : featuredProperties.length === 0 ? (
          <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
            <Building2 className="mx-auto h-10 w-10 text-slate-400" />
            <h3 className="mt-4 text-xl font-semibold text-slate-950">No approved properties yet</h3>
            <p className="mt-2 text-sm text-slate-600">Create or approve listings to make this section come alive.</p>
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {featuredProperties.map((property) => (
              <PropertyCard key={property._id} property={property} />
            ))}
          </div>
        )}
      </section>

      <section className="border-y border-slate-200 bg-slate-950 py-14 text-white">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-200">Why RealEstateHub</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight">Designed for serious property decisions.</h2>
              <p className="mt-4 text-sm leading-7 text-slate-300">
                Real estate needs a calm, trustworthy experience. Every core action is visible, direct, and built for
                mobile as well as desktop.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {highlights.map((item) => {
                const Icon = item.icon;

                return (
                  <article key={item.title} className="rounded-3xl border border-white/10 bg-white/[0.06] p-5">
                    <span className="grid h-11 w-11 place-items-center rounded-2xl bg-blue-400/15 text-blue-100">
                      <Icon className="h-5 w-5" />
                    </span>
                    <h3 className="mt-4 text-lg font-semibold">{item.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-300">{item.description}</p>
                  </article>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="mb-8 max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary/80">Built for every role</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">One marketplace, three clear workflows.</h2>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {roleCards.map((item) => {
            const Icon = item.icon;

            return (
              <article key={item.title} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-slate-100 text-slate-700">
                  <Icon className="h-6 w-6" />
                </span>
                <h3 className="mt-5 text-xl font-semibold text-slate-950">{item.title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">{item.description}</p>
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
}
