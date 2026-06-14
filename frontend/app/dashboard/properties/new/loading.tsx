import { PageSkeleton } from "@/components/common/page-skeleton";

export default function Loading() {
  return (
    <PageSkeleton
      title="Create property"
      subtitle="Loading the create form."
      variant="panel"
    />
  );
}
