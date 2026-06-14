import { ProtectedRoute } from "@/components/auth/protected-route";
import { RoutePlaceholder } from "@/components/common/route-placeholder";

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <RoutePlaceholder
        title="Profile"
        description="Profile route created for Phase 5. User profile UI will be implemented later."
      />
    </ProtectedRoute>
  );
}
