import { ProtectedRoute } from "@/components/auth/protected-route";
import { RoutePlaceholder } from "@/components/common/route-placeholder";

export default function FavoritesPage() {
  return (
    <ProtectedRoute>
      <RoutePlaceholder
        title="Favorites"
        description="Favorites route created for Phase 5. Favorite property list will be implemented later."
      />
    </ProtectedRoute>
  );
}
