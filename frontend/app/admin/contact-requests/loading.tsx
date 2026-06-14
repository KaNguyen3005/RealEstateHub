import { PageSkeleton } from "@/components/common/page-skeleton";

export default function Loading() {
  return (
    <PageSkeleton
      title="Contact requests"
      subtitle="Loading customer requests."
      variant="list"
    />
  );
}
