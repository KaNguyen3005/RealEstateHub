const Favorite = require("../src/models/Favorite");
const favoriteService = require("../src/services/favorite.service");
const { connectTestDb, clearTestDb, disconnectTestDb } = require("./helpers/testDb");
const { createTestProperty, createTestUser } = require("./helpers/factories");

describe("Favorite service", () => {
  beforeAll(connectTestDb);
  afterEach(clearTestDb);
  afterAll(disconnectTestDb);

  it("adds an approved property to favorites", async () => {
    const buyer = await createTestUser({ role: "user" });
    const seller = await createTestUser({ role: "seller" });
    const property = await createTestProperty(seller._id, { status: "approved" });

    const favoritedProperty = await favoriteService.addFavorite(buyer._id, property._id);

    expect(String(favoritedProperty._id)).toBe(String(property._id));
    await expect(Favorite.countDocuments({ userId: buyer._id, propertyId: property._id })).resolves.toBe(1);
  });

  it("rejects duplicate favorite records", async () => {
    const buyer = await createTestUser({ role: "user" });
    const seller = await createTestUser({ role: "seller" });
    const property = await createTestProperty(seller._id, { status: "approved" });

    await favoriteService.addFavorite(buyer._id, property._id);

    await expect(favoriteService.addFavorite(buyer._id, property._id)).rejects.toMatchObject({
      statusCode: 409,
      message: "Property is already in favorites"
    });
  });

  it("rejects favorite creation for a non-approved property", async () => {
    const buyer = await createTestUser({ role: "user" });
    const seller = await createTestUser({ role: "seller" });
    const property = await createTestProperty(seller._id, { status: "pending" });

    await expect(favoriteService.addFavorite(buyer._id, property._id)).rejects.toMatchObject({
      statusCode: 400,
      message: "Property is not available for favorites"
    });
  });

  it("returns only approved favorite properties", async () => {
    const buyer = await createTestUser({ role: "user" });
    const seller = await createTestUser({ role: "seller" });
    const approvedProperty = await createTestProperty(seller._id, {
      title: "Approved Favorite Home",
      status: "approved"
    });
    const hiddenProperty = await createTestProperty(seller._id, {
      title: "Hidden Favorite Home",
      status: "hidden"
    });

    await Favorite.create({ userId: buyer._id, propertyId: approvedProperty._id });
    await Favorite.create({ userId: buyer._id, propertyId: hiddenProperty._id });

    const result = await favoriteService.getUserFavorites(buyer._id);

    expect(result.items).toHaveLength(1);
    expect(result.favoriteIds).toEqual([String(approvedProperty._id)]);
  });

  it("removes an existing favorite", async () => {
    const buyer = await createTestUser({ role: "user" });
    const seller = await createTestUser({ role: "seller" });
    const property = await createTestProperty(seller._id, { status: "approved" });
    await Favorite.create({ userId: buyer._id, propertyId: property._id });

    const result = await favoriteService.removeFavorite(buyer._id, property._id);

    expect(result).toMatchObject({
      removed: true,
      propertyId: String(property._id)
    });
    await expect(Favorite.countDocuments({ userId: buyer._id, propertyId: property._id })).resolves.toBe(0);
  });
});
