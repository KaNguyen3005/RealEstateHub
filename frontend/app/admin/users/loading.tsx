import { PageSkeleton } from "@/components/common/page-skeleton";

export default function Loading() {
  return (
    <PageSkeleton
      title="Users"
      subtitle="Loading user management."
      variant="list"
    />
  );
}
