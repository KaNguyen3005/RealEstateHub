import { PageSkeleton } from "@/components/common/page-skeleton";

export default function Loading() {
  return (
    <PageSkeleton
      title="Loading page"
      subtitle="Preparing the next screen for you."
      variant="hero"
    />
  );
}
