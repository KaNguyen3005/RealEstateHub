import { PageSkeleton } from "@/components/common/page-skeleton";

export default function Loading() {
  return (
    <PageSkeleton
      title="Chat"
      subtitle="Loading conversations."
      variant="detail"
    />
  );
}
