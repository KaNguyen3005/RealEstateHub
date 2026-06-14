import { describe, expect, it } from "vitest";

import { propertySchema } from "@/lib/validations/property.schema";

function buildPropertyPayload(overrides = {}) {
  return {
    title: "Modern apartment in District 1",
    description: "A bright apartment with enough detail for validation.",
    type: "apartment",
    purpose: "sale",
    price: "1200000000",
    area: "72",
    bedrooms: "2",
    bathrooms: "2",
    address: "123 Test Street",
    city: "Ho Chi Minh",
    district: "District 1",
    ward: "Ben Nghe",
    latitude: "10.7769",
    longitude: "106.7009",
    images: ["https://example.com/property.jpg"],
    amenities: "Balcony, Parking",
    ...overrides,
  };
}

describe("property validation schema", () => {
  it("coerces valid property form values", () => {
    const result = propertySchema.safeParse(buildPropertyPayload());

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.price).toBe(1200000000);
      expect(result.data.area).toBe(72);
      expect(result.data.bedrooms).toBe(2);
      expect(result.data.amenities).toEqual(["Balcony", "Parking"]);
    }
  });

  it("rejects non-positive price and area", () => {
    const result = propertySchema.safeParse(
      buildPropertyPayload({
        price: "0",
        area: "-1",
      })
    );

    expect(result.success).toBe(false);
    if (!result.success) {
      const errors = result.error.flatten().fieldErrors;
      expect(errors.price).toContain("Price must be greater than 0");
      expect(errors.area).toContain("Area must be greater than 0");
    }
  });

  it("requires at least one uploaded image", () => {
    const result = propertySchema.safeParse(buildPropertyPayload({ images: [] }));

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.images).toContain("Upload at least 1 image");
    }
  });

  it("limits images to 10 files", () => {
    const result = propertySchema.safeParse(
      buildPropertyPayload({
        images: Array.from({ length: 11 }, (_, index) => `https://example.com/${index}.jpg`),
      })
    );

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.images).toContain("Images must not exceed 10 files");
    }
  });
});
