import { describe, expect, it } from "vitest";

import {
  formatAddress,
  formatPrice,
  formatPropertyPurpose,
  formatPropertyStatus,
  formatPropertyType,
  isClosedProperty,
} from "@/lib/property-format";

describe("property formatting helpers", () => {
  it("formats sale and rent prices for Vietnamese currency display", () => {
    expect(formatPrice(1200000000, "sale")).toMatch(/^1\.200\.000\.000/);
    expect(formatPrice(15000000, "rent")).toMatch(/^15\.000\.000/);
    expect(formatPrice(15000000, "rent")).toMatch(/\/mo$/);
  });

  it("formats property type, purpose, and status labels", () => {
    expect(formatPropertyType("apartment")).toBe("Apartment");
    expect(formatPropertyPurpose("rent")).toBe("For rent");
    expect(formatPropertyStatus("pending")).toBe("Pending");
    expect(formatPropertyStatus("sold")).toBe("Sold");
    expect(formatPropertyStatus("rented")).toBe("Rented");
  });

  it("detects sold and rented properties as closed", () => {
    expect(isClosedProperty({ status: "sold" })).toBe(true);
    expect(isClosedProperty({ status: "rented" })).toBe(true);
    expect(isClosedProperty({ status: "approved" })).toBe(false);
  });

  it("joins address parts while skipping missing optional values", () => {
    expect(
      formatAddress({
        address: "123 Nguyen Hue",
        ward: undefined,
        district: "District 1",
        city: "Ho Chi Minh",
      })
    ).toBe("123 Nguyen Hue, District 1, Ho Chi Minh");
  });
});
