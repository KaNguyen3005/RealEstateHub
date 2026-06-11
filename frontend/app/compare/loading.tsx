import { PageSkeleton } from "@/components/common/page-skeleton";

export default function Loading() {
  return (
    <PageSkeleton
      title="Compare properties"
      subtitle="Loading comparison data."
      variant="list"
    />
  );
}
