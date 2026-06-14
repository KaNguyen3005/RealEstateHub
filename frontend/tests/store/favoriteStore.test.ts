import { beforeEach, describe, expect, it } from "vitest";

import { useFavoriteStore } from "@/store/favoriteStore";

describe("favorite store", () => {
  beforeEach(() => {
    localStorage.clear();
    useFavoriteStore.setState({ favoriteIds: [] });
  });

  it("sets favorite ids from the backend", () => {
    useFavoriteStore.getState().setFavorites(["property-1", "property-2"]);

    expect(useFavoriteStore.getState().favoriteIds).toEqual(["property-1", "property-2"]);
  });

  it("replaces stale favorite ids when backend favorites are loaded again", () => {
    useFavoriteStore.setState({ favoriteIds: ["stale-property"] });

    useFavoriteStore.getState().setFavorites(["property-3"]);

    expect(useFavoriteStore.getState().favoriteIds).toEqual(["property-3"]);
  });

  it("adds favorites without duplicates", () => {
    useFavoriteStore.getState().addFavorite("property-1");
    useFavoriteStore.getState().addFavorite("property-1");

    expect(useFavoriteStore.getState().favoriteIds).toEqual(["property-1"]);
  });

  it("removes favorites", () => {
    useFavoriteStore.setState({ favoriteIds: ["property-1", "property-2"] });

    useFavoriteStore.getState().removeFavorite("property-1");

    expect(useFavoriteStore.getState().favoriteIds).toEqual(["property-2"]);
  });
});
