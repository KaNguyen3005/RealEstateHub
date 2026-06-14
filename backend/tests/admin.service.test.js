const ContactRequest = require("../src/models/ContactRequest");
const Conversation = require("../src/models/Conversation");
const adminService = require("../src/services/admin.service");
const { connectTestDb, clearTestDb, disconnectTestDb } = require("./helpers/testDb");
const { createTestProperty, createTestUser } = require("./helpers/factories");

describe("Admin service", () => {
  beforeAll(connectTestDb);
  afterEach(clearTestDb);
  afterAll(disconnectTestDb);

  it("returns dashboard statistics", async () => {
    const seller = await createTestUser({ role: "seller" });
    const buyer = await createTestUser({ role: "user", status: "blocked" });
    const approvedProperty = await createTestProperty(seller._id, { status: "approved" });
    await createTestProperty(seller._id, { status: "pending" });
    await ContactRequest.create({
      propertyId: approvedProperty._id,
      userId: buyer._id,
      name: "Buyer",
      email: "buyer@example.com",
      phone: "0901234567",
      message: "Please contact me soon.",
      status: "new"
    });
    await Conversation.create({
      propertyId: approvedProperty._id,
      participants: [buyer._id, seller._id]
    });

    const stats = await adminService.getStats();

    expect(stats).toMatchObject({
      users: {
        total: 2,
        active: 1,
        blocked: 1
      },
      properties: {
        total: 2,
        pending: 1,
        approved: 1
      },
      contactRequests: {
        total: 1,
        new: 1
      },
      conversations: {
        total: 1
      }
    });
  });

  it("updates a property moderation status", async () => {
    const seller = await createTestUser({ role: "seller" });
    const property = await createTestProperty(seller._id, { status: "pending" });

    const updated = await adminService.updatePropertyModerationStatus(property._id, "approved");

    expect(updated.status).toBe("approved");
    expect(String(updated.ownerId._id)).toBe(String(seller._id));
  });

  it("blocks a user and clears their refresh token", async () => {
    const admin = await createTestUser({ role: "admin" });
    const user = await createTestUser({
      role: "user",
      refreshToken: "old-refresh-token"
    });

    const updated = await adminService.updateUserStatus(user._id, "blocked", admin);

    expect(updated.status).toBe("blocked");
    expect(updated.refreshToken).toBe("");
  });

  it("prevents an admin from blocking their own account", async () => {
    const admin = await createTestUser({ role: "admin" });

    await expect(adminService.updateUserStatus(admin._id, "blocked", admin)).rejects.toMatchObject({
      statusCode: 400,
      message: "You cannot block your own admin account"
    });
  });

  it("rejects invalid role updates", async () => {
    const user = await createTestUser({ role: "user" });

    await expect(adminService.updateUserRole(user._id, "owner")).rejects.toMatchObject({
      statusCode: 400,
      message: "Invalid role"
    });
  });
});
