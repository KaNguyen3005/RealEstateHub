import { PageSkeleton } from "@/components/common/page-skeleton";

export default function Loading() {
  return (
    <PageSkeleton
      title="Profile"
      subtitle="Loading account details."
      variant="panel"
    />
  );
}
