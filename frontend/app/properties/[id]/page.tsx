import { RoutePlaceholder } from "@/components/common/route-placeholder";

interface PropertyDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function PropertyDetailPage({ params }: PropertyDetailPageProps) {
  const { id } = await params;

  return (
    <RoutePlaceholder
      title={`Property detail: ${id}`}
      description="Dynamic route created for Phase 5. Data fetching will be added later."
    />
  );
}
