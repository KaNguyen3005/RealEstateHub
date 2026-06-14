import { describe, expect, it } from "vitest";

import { loginSchema, registerSchema } from "@/lib/validations/auth.schema";

describe("auth validation schemas", () => {
  it("accepts a valid register payload and trims values", () => {
    const result = registerSchema.safeParse({
      fullName: "  Nguyen Van A  ",
      email: " buyer@example.com ",
      phone: " 0901234567 ",
      role: "user",
      password: "Password123",
      confirmPassword: "Password123",
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toMatchObject({
        fullName: "Nguyen Van A",
        email: "buyer@example.com",
        phone: "0901234567",
        role: "user",
      });
    }
  });

  it("rejects mismatched register passwords", () => {
    const result = registerSchema.safeParse({
      fullName: "Nguyen Van A",
      email: "buyer@example.com",
      role: "seller",
      password: "Password123",
      confirmPassword: "Different123",
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.confirmPassword).toContain(
        "Password confirmation does not match"
      );
    }
  });

  it("rejects public admin registration", () => {
    const result = registerSchema.safeParse({
      fullName: "Admin User",
      email: "admin@example.com",
      role: "admin",
      password: "Password123",
      confirmPassword: "Password123",
    });

    expect(result.success).toBe(false);
  });

  it("accepts valid login data", () => {
    const result = loginSchema.safeParse({
      email: " user@example.com ",
      password: "Password123",
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.email).toBe("user@example.com");
    }
  });

  it("rejects an invalid login email", () => {
    const result = loginSchema.safeParse({
      email: "invalid-email",
      password: "Password123",
    });

    expect(result.success).toBe(false);
  });
});
