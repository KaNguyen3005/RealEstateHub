import { PageSkeleton } from "@/components/common/page-skeleton";

export default function Loading() {
  return (
    <PageSkeleton
      title="My properties"
      subtitle="Loading your property table."
      variant="list"
    />
  );
}
