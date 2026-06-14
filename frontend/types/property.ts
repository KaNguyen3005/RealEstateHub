import type { User } from "@/types/user";

export type PropertyType = "apartment" | "house" | "land" | "villa" | "office";
export type PropertyPurpose = "sale" | "rent";
export type PropertyStatus = "pending" | "approved" | "rejected" | "hidden" | "sold" | "rented";

export interface Property {
  _id: string;
  title: string;
  slug?: string;
  description: string;
  type: PropertyType;
  purpose: PropertyPurpose;
  price: number;
  area: number;
  bedrooms: number;
  bathrooms: number;
  address: string;
  city: string;
  district?: string;
  ward?: string;
  latitude: number;
  longitude: number;
  images: string[];
  amenities: string[];
  ownerId?: Pick<User, "_id" | "fullName" | "email" | "role" | "avatar"> | string;
  status: PropertyStatus;
  createdAt: string;
  updatedAt: string;
}

export interface PropertyListParams {
  keyword?: string;
  city?: string;
  district?: string;
  type?: PropertyType | "";
  purpose?: PropertyPurpose | "";
  minPrice?: string;
  maxPrice?: string;
  minArea?: string;
  maxArea?: string;
  page?: string;
  limit?: string;
  status?: PropertyStatus | "";
  mine?: "1";
}

export interface PropertyListResult {
  items: Property[];
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
}
