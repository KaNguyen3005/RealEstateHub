import { describe, expect, it } from "vitest";

import { contactRequestSchema } from "@/lib/validations/contact.schema";

describe("contact request validation schema", () => {
  it("accepts valid contact request data and trims strings", () => {
    const result = contactRequestSchema.safeParse({
      propertyId: " property-id ",
      name: " Buyer ",
      email: " buyer@example.com ",
      phone: " 0901234567 ",
      message: " I want to schedule a viewing. ",
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toMatchObject({
        propertyId: "property-id",
        name: "Buyer",
        email: "buyer@example.com",
        phone: "0901234567",
        message: "I want to schedule a viewing.",
      });
    }
  });

  it("rejects invalid email and short message", () => {
    const result = contactRequestSchema.safeParse({
      propertyId: "property-id",
      name: "B",
      email: "bad-email",
      phone: "",
      message: "short",
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      const errors = result.error.flatten().fieldErrors;
      expect(errors.name).toContain("Name must be at least 2 characters");
      expect(errors.email).toContain("Enter a valid email address");
      expect(errors.phone).toContain("Phone is required");
      expect(errors.message).toContain("Message must be at least 10 characters");
    }
  });

  it("rejects whitespace-only property id after trimming input", () => {
    const result = contactRequestSchema.safeParse({
      propertyId: "   ",
      name: "Buyer",
      email: "buyer@example.com",
      phone: "0901234567",
      message: "I want to schedule a viewing.",
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.propertyId).toContain("Property is required");
    }
  });
});
