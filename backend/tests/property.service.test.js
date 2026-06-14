const propertyService = require("../src/services/property.service");
const { connectTestDb, clearTestDb, disconnectTestDb } = require("./helpers/testDb");
const {
  buildPropertyPayload,
  createTestProperty,
  createTestUser
} = require("./helpers/factories");

describe("Property service", () => {
  beforeAll(connectTestDb);
  afterEach(clearTestDb);
  afterAll(disconnectTestDb);

  it("creates a seller property with pending status", async () => {
    const seller = await createTestUser({ role: "seller" });

    const property = await propertyService.createProperty(seller._id, buildPropertyPayload());

    expect(property.status).toBe("pending");
    expect(String(property.ownerId._id)).toBe(String(seller._id));
    expect(property.slug).toEqual(expect.stringContaining(String(property._id).slice(-6)));
  });

  it("rejects a property with price 0", async () => {
    const seller = await createTestUser({ role: "seller" });

    await expect(
      propertyService.createProperty(seller._id, buildPropertyPayload({ price: 0 }))
    ).rejects.toMatchObject({
      statusCode: 400,
      message: "price must be greater than 0"
    });
  });

  it("rejects a property without images", async () => {
    const seller = await createTestUser({ role: "seller" });

    await expect(
      propertyService.createProperty(seller._id, buildPropertyPayload({ images: [] }))
    ).rejects.toMatchObject({
      statusCode: 400
    });
  });

  it("returns only approved properties for public listing", async () => {
    const seller = await createTestUser({ role: "seller" });
    await createTestProperty(seller._id, { title: "Approved Public Home", status: "approved" });
    await createTestProperty(seller._id, { title: "Pending Private Home", status: "pending" });
    await createTestProperty(seller._id, { title: "Hidden Private Home", status: "hidden" });

    const result = await propertyService.getProperties({}, null);

    expect(result.totalItems).toBe(1);
    expect(result.items).toHaveLength(1);
    expect(result.items[0].title).toBe("Approved Public Home");
    expect(result.items[0].status).toBe("approved");
  });

  it("prevents a seller from updating another seller's property", async () => {
    const owner = await createTestUser({ role: "seller" });
    const otherSeller = await createTestUser({ role: "seller" });
    const property = await createTestProperty(owner._id, { status: "approved" });

    await expect(
      propertyService.updateProperty(otherSeller, property._id, {
        title: "Updated By Wrong Seller"
      })
    ).rejects.toMatchObject({
      statusCode: 403,
      message: "Forbidden"
    });
  });

  it("moves an approved property back to pending when its seller edits it", async () => {
    const seller = await createTestUser({ role: "seller" });
    const property = await createTestProperty(seller._id, { status: "approved" });

    const updated = await propertyService.updateProperty(seller, property._id, {
      title: "Seller Edited Property"
    });

    expect(updated.title).toBe("Seller Edited Property");
    expect(updated.status).toBe("pending");
  });

  it("limits compare requests to at most 3 properties", async () => {
    const ids = ["64b000000000000000000001", "64b000000000000000000002", "64b000000000000000000003", "64b000000000000000000004"];

    await expect(propertyService.getPropertiesForCompare(ids.join(","), null)).rejects.toMatchObject({
      statusCode: 400,
      message: "You can compare up to 3 properties"
    });
  });

  it("returns only viewable properties for compare", async () => {
    const seller = await createTestUser({ role: "seller" });
    const approved = await createTestProperty(seller._id, {
      title: "Approved Compare Home",
      status: "approved"
    });
    const pending = await createTestProperty(seller._id, {
      title: "Pending Compare Home",
      status: "pending"
    });

    const result = await propertyService.getPropertiesForCompare(`${approved._id},${pending._id}`, null);

    expect(result.items).toHaveLength(1);
    expect(result.items[0].title).toBe("Approved Compare Home");
  });
});
