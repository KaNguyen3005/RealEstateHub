interface PageSkeletonProps {
  title: string;
  subtitle?: string;
  variant?: "hero" | "list" | "detail" | "panel";
}

function SkeletonBlock({ className }: { className: string }) {
  return <div className={`animate-pulse rounded-2xl bg-muted/70 ${className}`} />;
}

export function PageSkeleton({
  title,
  subtitle,
  variant = "panel",
}: PageSkeletonProps) {
  const content =
    variant === "hero" ? (
      <div className="space-y-6">
        <div className="space-y-4">
          <SkeletonBlock className="h-4 w-28" />
          <SkeletonBlock className="h-12 w-3/4" />
          <SkeletonBlock className="h-5 w-full" />
          <SkeletonBlock className="h-5 w-5/6" />
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <SkeletonBlock className="h-28" />
          <SkeletonBlock className="h-28" />
          <SkeletonBlock className="h-28" />
        </div>
      </div>
    ) : variant === "list" ? (
      <div className="space-y-4">
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="space-y-3 rounded-[24px] border border-border/70 bg-background/80 p-4">
              <SkeletonBlock className="h-44" />
              <SkeletonBlock className="h-5 w-3/4" />
              <SkeletonBlock className="h-4 w-1/2" />
              <SkeletonBlock className="h-4 w-2/3" />
            </div>
          ))}
        </div>
      </div>
    ) : variant === "detail" ? (
      <div className="grid gap-6 lg:grid-cols-[1.4fr_0.9fr]">
        <div className="space-y-4">
          <SkeletonBlock className="h-80" />
          <div className="grid gap-3 sm:grid-cols-3">
            <SkeletonBlock className="h-24" />
            <SkeletonBlock className="h-24" />
            <SkeletonBlock className="h-24" />
          </div>
        </div>
        <div className="space-y-4">
          <SkeletonBlock className="h-12 w-3/5" />
          <SkeletonBlock className="h-5 w-full" />
          <SkeletonBlock className="h-5 w-11/12" />
          <SkeletonBlock className="h-5 w-10/12" />
          <SkeletonBlock className="h-44" />
        </div>
      </div>
    ) : (
      <div className="space-y-4">
        <SkeletonBlock className="h-10 w-48" />
        <SkeletonBlock className="h-5 w-2/3" />
        <SkeletonBlock className="h-5 w-1/2" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <SkeletonBlock key={index} className="h-28" />
          ))}
        </div>
      </div>
    );

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="rounded-[28px] border border-border/70 bg-background/85 p-6 shadow-[0_20px_60px_rgba(53,36,20,0.08)] backdrop-blur-xl sm:p-8">
        <div className="mb-6 space-y-2">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary/80">
            Loading
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            {title}
          </h1>
          {subtitle ? (
            <p className="max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
              {subtitle}
            </p>
          ) : null}
        </div>
        {content}
      </div>
    </section>
  );
}
