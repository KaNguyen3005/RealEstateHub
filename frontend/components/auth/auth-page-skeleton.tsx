import { LoadingSpinner } from "@/components/common/loading-spinner";

interface AuthPageSkeletonProps {
  title: string;
  description: string;
}

export function AuthPageSkeleton({ title, description }: AuthPageSkeletonProps) {
  return (
    <section className="mx-auto w-full max-w-2xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="rounded-[28px] border border-border/70 bg-background/85 p-6 shadow-[0_20px_60px_rgba(53,36,20,0.08)] backdrop-blur-xl sm:p-8">
        <div className="mb-8 space-y-3">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary/80">
            Please wait
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            {title}
          </h1>
          <p className="max-w-xl text-sm leading-6 text-muted-foreground sm:text-base">
            {description}
          </p>
        </div>

        <div className="space-y-5">
          <div className="space-y-4">
            <div className="h-10 rounded-md bg-muted/70" />
            <div className="h-10 rounded-md bg-muted/70" />
          </div>

          <div className="flex items-center gap-3 rounded-2xl border border-border/60 bg-muted/30 px-4 py-3">
            <LoadingSpinner label="Loading page..." />
          </div>

          <div className="flex gap-3 pt-2">
            <div className="h-10 w-28 rounded-md bg-muted/70" />
            <div className="h-10 w-40 rounded-md bg-muted/50" />
          </div>
        </div>
      </div>
    </section>
  );
}
