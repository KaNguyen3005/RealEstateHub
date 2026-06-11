import { PageSkeleton } from "@/components/common/page-skeleton";

export default function Loading() {
  return (
    <PageSkeleton
      title="Properties"
      subtitle="Loading property approval items."
      variant="list"
    />
  );
}
