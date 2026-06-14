"use client";

import { GitCompare } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useCompareStore } from "@/store/compareStore";

interface CompareButtonProps {
  propertyId: string;
}

export function CompareButton({ propertyId }: CompareButtonProps) {
  const propertyIds = useCompareStore((state) => state.propertyIds);
  const addToCompare = useCompareStore((state) => state.addToCompare);
  const removeFromCompare = useCompareStore((state) => state.removeFromCompare);
  const isSelected = propertyIds.includes(propertyId);
  const isDisabled = !isSelected && propertyIds.length >= 3;

  return (
    <Button
      type="button"
      variant={isSelected ? "secondary" : "outline"}
      size="sm"
      disabled={isDisabled}
      onClick={() => (isSelected ? removeFromCompare(propertyId) : addToCompare(propertyId))}
    >
      <GitCompare className="h-4 w-4" />
      {isSelected ? "Compared" : "Compare"}
    </Button>
  );
}
