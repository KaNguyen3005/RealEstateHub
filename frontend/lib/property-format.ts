import type { Property, PropertyPurpose, PropertyStatus, PropertyType } from "@/types/property";

const typeLabels: Record<PropertyType, string> = {
  apartment: "Apartment",
  house: "House",
  land: "Land",
  villa: "Villa",
  office: "Office",
};

const purposeLabels: Record<PropertyPurpose, string> = {
  sale: "For sale",
  rent: "For rent",
};

const statusLabels: Record<PropertyStatus, string> = {
  pending: "Pending",
  approved: "Approved",
  rejected: "Rejected",
  hidden: "Hidden",
  sold: "Sold",
  rented: "Rented",
};

export function formatPropertyType(type: PropertyType) {
  return typeLabels[type] ?? type;
}

export function formatPropertyPurpose(purpose: PropertyPurpose) {
  return purposeLabels[purpose] ?? purpose;
}

export function formatPropertyStatus(status: PropertyStatus) {
  return statusLabels[status] ?? status;
}

export function isClosedProperty(property: Pick<Property, "status">) {
  return property.status === "sold" || property.status === "rented";
}

export function formatPrice(price: number, purpose?: PropertyPurpose) {
  const formatted = new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(price);

  return purpose === "rent" ? `${formatted}/mo` : formatted;
}

export function formatAddress(property: Pick<Property, "address" | "ward" | "district" | "city">) {
  return [property.address, property.ward, property.district, property.city].filter(Boolean).join(", ");
}
