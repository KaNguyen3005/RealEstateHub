export type UserRole = "admin" | "seller" | "user";

export interface User {
  _id: string;
  fullName: string;
  email: string;
  phone?: string;
  role: UserRole;
  avatar?: string;
  status: "active" | "blocked";
  createdAt: string;
  updatedAt: string;
}
