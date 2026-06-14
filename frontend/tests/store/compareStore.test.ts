import { beforeEach, describe, expect, it } from "vitest";

import { useCompareStore } from "@/store/compareStore";

describe("compare store", () => {
  beforeEach(() => {
    localStorage.clear();
    useCompareStore.setState({ propertyIds: [] });
  });

  it("adds property ids without duplicates", () => {
    useCompareStore.getState().addToCompare("property-1");
    useCompareStore.getState().addToCompare("property-1");

    expect(useCompareStore.getState().propertyIds).toEqual(["property-1"]);
  });

  it("limits compare list to 3 properties", () => {
    useCompareStore.getState().addToCompare("property-1");
    useCompareStore.getState().addToCompare("property-2");
    useCompareStore.getState().addToCompare("property-3");
    useCompareStore.getState().addToCompare("property-4");

    expect(useCompareStore.getState().propertyIds).toEqual([
      "property-1",
      "property-2",
      "property-3",
    ]);
  });

  it("keeps the compare list unchanged when removing an unknown property", () => {
    useCompareStore.setState({ propertyIds: ["property-1", "property-2"] });

    useCompareStore.getState().removeFromCompare("property-99");

    expect(useCompareStore.getState().propertyIds).toEqual(["property-1", "property-2"]);
  });

  it("removes property ids and clears the list", () => {
    useCompareStore.setState({ propertyIds: ["property-1", "property-2"] });

    useCompareStore.getState().removeFromCompare("property-1");
    expect(useCompareStore.getState().propertyIds).toEqual(["property-2"]);

    useCompareStore.getState().clearCompare();
    expect(useCompareStore.getState().propertyIds).toEqual([]);
  });
});
