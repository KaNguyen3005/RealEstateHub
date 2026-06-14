interface RoutePlaceholderProps {
  title: string;
  description?: string;
}

export function RoutePlaceholder({ title, description }: RoutePlaceholderProps) {
  return (
    <section className="mx-auto flex min-h-[60vh] w-full max-w-5xl flex-col items-start justify-center gap-4 px-4 py-16 sm:px-6 lg:px-8">
      <p className="text-sm font-medium uppercase tracking-[0.28em] text-primary/80">
        Placeholder route
      </p>
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          {title}
        </h1>
        {description ? <p className="max-w-2xl text-base text-muted-foreground">{description}</p> : null}
      </div>
    </section>
  );
}
