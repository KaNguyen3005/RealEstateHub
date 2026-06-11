import { LoginForm } from "@/components/auth/login-form";

interface LoginPageProps {
  searchParams?: {
    registered?: string;
    loggedOut?: string;
  };
}

export default function LoginPage({ searchParams }: LoginPageProps) {
  const initialNotice =
    searchParams?.registered === "1"
      ? "Registration successful. Please sign in with your new account."
      : searchParams?.loggedOut === "1"
        ? "You have been signed out successfully."
        : null;

  return <LoginForm initialNotice={initialNotice} />;
}
