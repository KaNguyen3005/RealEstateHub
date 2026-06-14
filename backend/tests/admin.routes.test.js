const request = require("supertest");

const { createApp } = require("../src/app");
const { createAccessToken } = require("../src/utils/token");
const { connectTestDb, clearTestDb, disconnectTestDb } = require("./helpers/testDb");
const { createTestUser } = require("./helpers/factories");

function createAuthHeader(user) {
  const token = createAccessToken({
    userId: String(user._id),
    role: user.role
  });

  return `Bearer ${token}`;
}

describe("Admin routes", () => {
  const app = createApp();

  beforeAll(connectTestDb);
  afterEach(clearTestDb);
  afterAll(disconnectTestDb);

  it("rejects unauthenticated admin requests", async () => {
    const response = await request(app).get("/api/admin/stats").expect(401);

    expect(response.body).toMatchObject({
      success: false,
      message: "Access token is required"
    });
  });

  it("rejects admin requests with an invalid access token", async () => {
    const response = await request(app)
      .get("/api/admin/stats")
      .set("Authorization", "Bearer invalid-token")
      .expect(401);

    expect(response.body).toMatchObject({
      success: false,
      message: "Invalid access token"
    });
  });

  it("rejects non-admin users", async () => {
    const user = await createTestUser({ role: "user" });

    const response = await request(app)
      .get("/api/admin/stats")
      .set("Authorization", createAuthHeader(user))
      .expect(403);

    expect(response.body).toMatchObject({
      success: false,
      message: "Forbidden"
    });
  });

  it("allows admin users to access stats", async () => {
    const admin = await createTestUser({ role: "admin" });

    const response = await request(app)
      .get("/api/admin/stats")
      .set("Authorization", createAuthHeader(admin))
      .expect(200);

    expect(response.body).toMatchObject({
      success: true,
      message: "Admin stats retrieved successfully"
    });
    expect(response.body.data.users.total).toBe(1);
  });
});
