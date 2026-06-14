import Link from "next/link";
import { Inbox } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
  className?: string;
}

export function EmptyState({
  title,
  description,
  actionLabel,
  actionHref,
  onAction,
  className
}: EmptyStateProps) {
  const action = actionHref ? (
    <Button asChild>
      <Link href={actionHref}>{actionLabel ?? "Get started"}</Link>
    </Button>
  ) : onAction ? (
    <Button onClick={onAction}>{actionLabel ?? "Try again"}</Button>
  ) : null;

  return (
    <Card className={cn("border-dashed bg-muted/20", className)}>
      <CardHeader className="items-center text-center">
        <div className="mb-2 grid h-12 w-12 place-items-center rounded-full bg-primary/10 text-primary">
          <Inbox className="h-6 w-6" />
        </div>
        <CardTitle>{title}</CardTitle>
        <CardDescription className="max-w-md">{description}</CardDescription>
      </CardHeader>
      {action ? <CardContent className="flex justify-center pb-6">{action}</CardContent> : null}
    </Card>
  );
}
