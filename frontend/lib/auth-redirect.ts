import type { UserRole } from "@/types/user";

export function getRoleHomePath(role: UserRole) {
  if (role === "admin") {
    return "/admin";
  }

  if (role === "seller") {
    return "/dashboard";
  }

  return "/profile";
}

export function getSafeNextPath(nextPath?: string | null) {
  if (!nextPath || !nextPath.startsWith("/") || nextPath.startsWith("//")) {
    return null;
  }

  return nextPath;
}
