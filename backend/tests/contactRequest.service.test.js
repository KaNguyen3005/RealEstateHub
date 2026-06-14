const contactRequestService = require("../src/services/contactRequest.service");
const { connectTestDb, clearTestDb, disconnectTestDb } = require("./helpers/testDb");
const { createTestProperty, createTestUser } = require("./helpers/factories");

function buildContactPayload(propertyId, overrides = {}) {
  return {
    propertyId: String(propertyId),
    name: "Interested Buyer",
    email: "buyer@example.com",
    phone: "0901234567",
    message: "I would like to schedule a viewing.",
    ...overrides
  };
}

describe("Contact request service", () => {
  beforeAll(connectTestDb);
  afterEach(clearTestDb);
  afterAll(disconnectTestDb);

  it("creates a guest contact request for an approved property", async () => {
    const seller = await createTestUser({ role: "seller" });
    const property = await createTestProperty(seller._id, { status: "approved" });

    const request = await contactRequestService.createContactRequest(buildContactPayload(property._id), null);

    expect(request).toMatchObject({
      name: "Interested Buyer",
      email: "buyer@example.com",
      phone: "0901234567",
      message: "I would like to schedule a viewing.",
      status: "new"
    });
    expect(String(request.propertyId)).toBe(String(property._id));
    expect(request.userId).toBeUndefined();
  });

  it("normalizes guest contact request fields before saving", async () => {
    const seller = await createTestUser({ role: "seller" });
    const property = await createTestProperty(seller._id, { status: "approved" });

    const request = await contactRequestService.createContactRequest(
      buildContactPayload(property._id, {
        name: "  Interested Buyer  ",
        email: "  BUYER@EXAMPLE.COM  ",
        phone: "  0901234567  ",
        message: "  I would like to schedule a viewing.  "
      }),
      null
    );

    expect(request).toMatchObject({
      name: "Interested Buyer",
      email: "buyer@example.com",
      phone: "0901234567",
      message: "I would like to schedule a viewing."
    });
  });

  it("attaches the current user when a logged-in user submits a contact request", async () => {
    const seller = await createTestUser({ role: "seller" });
    const buyer = await createTestUser({ role: "user" });
    const property = await createTestProperty(seller._id, { status: "approved" });

    const request = await contactRequestService.createContactRequest(
      buildContactPayload(property._id),
      buyer
    );

    expect(String(request.userId)).toBe(String(buyer._id));
  });

  it("rejects invalid contact email", async () => {
    const seller = await createTestUser({ role: "seller" });
    const property = await createTestProperty(seller._id, { status: "approved" });

    await expect(
      contactRequestService.createContactRequest(
        buildContactPayload(property._id, { email: "not-an-email" }),
        null
      )
    ).rejects.toMatchObject({
      statusCode: 400,
      message: "email is invalid"
    });
  });

  it("rejects contact requests for a missing property", async () => {
    await expect(
      contactRequestService.createContactRequest(
        buildContactPayload("64b000000000000000000001"),
        null
      )
    ).rejects.toMatchObject({
      statusCode: 404,
      message: "Property not found"
    });
  });

  it("rejects contact requests for non-approved properties", async () => {
    const seller = await createTestUser({ role: "seller" });
    const property = await createTestProperty(seller._id, { status: "pending" });

    await expect(
      contactRequestService.createContactRequest(buildContactPayload(property._id), null)
    ).rejects.toMatchObject({
      statusCode: 400,
      message: "Property is not available for contact requests"
    });
  });
});
