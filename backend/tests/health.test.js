const request = require("supertest");

const { createApp } = require("../src/app");

describe("Health API", () => {
  it("returns the API health status", async () => {
    const app = createApp();

    const response = await request(app).get("/api/health").expect(200);

    expect(response.body).toMatchObject({
      success: true,
      message: "RealEstateHub API is running"
    });
    expect(response.body.timestamp).toEqual(expect.any(String));
  });
});
