import { Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  className?: string;
  label?: string;
  size?: number;
}

export function LoadingSpinner({
  className,
  label = "Loading...",
  size = 20
}: LoadingSpinnerProps) {
  return (
    <div className={cn("inline-flex items-center gap-2 text-sm text-muted-foreground", className)}>
      <Loader2 className="animate-spin text-primary" style={{ width: size, height: size }} />
      <span>{label}</span>
    </div>
  );
}
