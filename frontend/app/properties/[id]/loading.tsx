import { PageSkeleton } from "@/components/common/page-skeleton";

export default function Loading() {
  return (
    <PageSkeleton
      title="Property detail"
      subtitle="Loading property information."
      variant="detail"
    />
  );
}
