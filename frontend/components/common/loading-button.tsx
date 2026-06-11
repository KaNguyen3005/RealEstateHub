import type { ReactNode } from "react";

import { Button, type ButtonProps } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/common/loading-spinner";

interface LoadingButtonProps extends ButtonProps {
  loading?: boolean;
  children: ReactNode;
}

export function LoadingButton({ loading = false, children, disabled, ...props }: LoadingButtonProps) {
  return (
    <Button disabled={disabled || loading} {...props}>
      {loading ? <LoadingSpinner label="" size={16} /> : null}
      {children}
    </Button>
  );
}
