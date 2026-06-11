import { ProtectedRoute } from "@/components/auth/protected-route";
import { RoutePlaceholder } from "@/components/common/route-placeholder";

export default function ChatPage() {
  return (
    <ProtectedRoute>
      <RoutePlaceholder
        title="Chat"
        description="Chat route created for Phase 5. Conversation UI will be implemented later."
      />
    </ProtectedRoute>
  );
}
