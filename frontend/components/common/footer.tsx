import Link from "next/link";

const footerLinks = [
  { href: "/properties", label: "Properties" },
  { href: "/compare", label: "Compare" },
  { href: "/login", label: "Login" },
  { href: "/register", label: "Register" }
] as const;

export function Footer() {
  return (
    <footer className="border-t border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 py-10 sm:px-6 lg:grid-cols-[1.3fr_1fr] lg:px-8">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-2xl bg-primary text-sm font-bold text-primary-foreground shadow-sm">
              RH
            </span>
            <div>
              <p className="font-semibold tracking-tight">RealEstateHub</p>
              <p className="text-sm text-muted-foreground">A mini real estate marketplace for buying, renting, and comparing properties.</p>
            </div>
          </div>
          <p className="max-w-xl text-sm leading-6 text-muted-foreground">
            Browse listings, compare properties, save favorites, and connect with sellers in one responsive platform.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Quick Links
            </p>
            <div className="flex flex-col gap-3">
              {footerLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Contact
            </p>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>Support for users, sellers, and admins</p>
              <p>Responsive across mobile, tablet, and desktop</p>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-border/60">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-2 px-4 py-4 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p>© 2026 RealEstateHub. All rights reserved.</p>
          <p>Built with Next.js App Router and Tailwind CSS.</p>
        </div>
      </div>
    </footer>
  );
}
