import { PageSkeleton } from "@/components/common/page-skeleton";

export default function Loading() {
  return (
    <PageSkeleton
      title="Edit property"
      subtitle="Loading the edit form."
      variant="panel"
    />
  );
}
