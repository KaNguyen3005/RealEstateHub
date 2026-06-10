"use client";

import { AlertTriangle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  loading?: boolean;
  destructive?: boolean;
  onConfirm: () => void | Promise<void>;
  onCancel: () => void;
  className?: string;
}

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  loading = false,
  destructive = false,
  onConfirm,
  onCancel,
  className
}: ConfirmDialogProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <Card className={cn("w-full max-w-md shadow-2xl", className)}>
        <CardHeader className="items-center text-center">
          <div
            className={cn(
              "mb-2 grid h-12 w-12 place-items-center rounded-full",
              destructive ? "bg-destructive/10 text-destructive" : "bg-primary/10 text-primary"
            )}
          >
            <AlertTriangle className="h-6 w-6" />
          </div>
          <CardTitle>{title}</CardTitle>
          <CardDescription className="max-w-sm">{description}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 sm:flex-row sm:justify-end">
          <Button variant="outline" onClick={onCancel} disabled={loading}>
            {cancelLabel}
          </Button>
          <Button variant={destructive ? "destructive" : "default"} onClick={onConfirm} disabled={loading}>
            {loading ? "Processing..." : confirmLabel}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
