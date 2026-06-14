import { PageSkeleton } from "@/components/common/page-skeleton";

export default function Loading() {
  return (
    <PageSkeleton
      title="Favorites"
      subtitle="Loading your saved properties."
      variant="list"
    />
  );
}
