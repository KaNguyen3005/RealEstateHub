import { ProtectedRoute } from "@/components/auth/protected-route";
import { RoutePlaceholder } from "@/components/common/route-placeholder";

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <RoutePlaceholder
        title="Trang cá nhân"
        description="Định tuyến Trang cá nhân được khởi tạo cho Giai đoạn 5. Giao diện hồ sơ người dùng sẽ được triển khai chi tiết sau."
      />
    </ProtectedRoute>
  );
}