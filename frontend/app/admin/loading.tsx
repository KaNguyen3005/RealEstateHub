import { PageSkeleton } from "@/components/common/page-skeleton";

export default function Loading() {
  return (
    <PageSkeleton
      title="Admin dashboard"
      subtitle="Loading admin controls."
      variant="panel"
    />
  );
}
