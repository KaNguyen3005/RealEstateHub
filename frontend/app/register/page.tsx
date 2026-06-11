import { AuthPageRedirect } from "@/components/auth/auth-page-redirect";
import { RegisterForm } from "@/components/auth/register-form";

export default function RegisterPage() {
  return (
    <AuthPageRedirect>
      <RegisterForm />
    </AuthPageRedirect>
  );
}
