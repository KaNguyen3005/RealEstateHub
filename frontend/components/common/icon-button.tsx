import type { ButtonHTMLAttributes, ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  icon: ReactNode;
}

export function IconButton({ label, icon, className, children, ...props }: IconButtonProps) {
  return (
    <Button
      variant="ghost"
      className={cn("inline-flex items-center gap-2 px-3", className)}
      aria-label={label}
      {...props}
    >
      {icon}
      {children ?? label}
    </Button>
  );
}
