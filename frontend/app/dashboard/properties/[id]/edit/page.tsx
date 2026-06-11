import { RoutePlaceholder } from "@/components/common/route-placeholder";

interface EditPropertyPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditPropertyPage({ params }: EditPropertyPageProps) {
  const { id } = await params;

  return (
    <RoutePlaceholder
      title={`Edit Property: ${id}`}
      description="Edit property route created for Phase 5. Edit form will be implemented later."
    />
  );
}
