const User = require("../src/models/User");
const authService = require("../src/services/auth.service");
const { connectTestDb, clearTestDb, disconnectTestDb } = require("./helpers/testDb");
const { createTestUser } = require("./helpers/factories");

describe("Auth service", () => {
  beforeAll(connectTestDb);
  afterEach(clearTestDb);
  afterAll(disconnectTestDb);

  it("registers a valid user and hides sensitive fields", async () => {
    const result = await authService.registerUser({
      fullName: "Nguyen Van A",
      email: "Buyer@Example.com",
      password: "Password123",
      role: "user"
    });

    expect(result.accessToken).toEqual(expect.any(String));
    expect(result.refreshToken).toEqual(expect.any(String));
    expect(result.user).toMatchObject({
      fullName: "Nguyen Van A",
      email: "buyer@example.com",
      role: "user",
      status: "active"
    });
    expect(result.user.passwordHash).toBeUndefined();
    expect(result.user.refreshToken).toBeUndefined();

    const storedUser = await User.findOne({ email: "buyer@example.com" });
    expect(storedUser.passwordHash).not.toBe("Password123");
    expect(storedUser.refreshToken).toBe(result.refreshToken);
  });

  it("rejects duplicate email registration", async () => {
    await authService.registerUser({
      fullName: "Nguyen Van A",
      email: "duplicate@example.com",
      password: "Password123",
      role: "seller"
    });

    await expect(
      authService.registerUser({
        fullName: "Nguyen Van B",
        email: "duplicate@example.com",
        password: "Password123",
        role: "user"
      })
    ).rejects.toMatchObject({
      statusCode: 409,
      message: "Email already exists"
    });
  });

  it("logs in with a correct password", async () => {
    await authService.registerUser({
      fullName: "Login User",
      email: "login@example.com",
      password: "Password123",
      role: "user"
    });

    const result = await authService.loginUser("login@example.com", "Password123");

    expect(result.accessToken).toEqual(expect.any(String));
    expect(result.refreshToken).toEqual(expect.any(String));
    expect(result.user.email).toBe("login@example.com");
    expect(result.user.passwordHash).toBeUndefined();
  });

  it("rejects login with an incorrect password", async () => {
    await authService.registerUser({
      fullName: "Wrong Password",
      email: "wrong-password@example.com",
      password: "Password123",
      role: "user"
    });

    await expect(authService.loginUser("wrong-password@example.com", "bad-password")).rejects.toMatchObject({
      statusCode: 401,
      message: "Invalid email or password"
    });
  });

  it("rejects login for a blocked user", async () => {
    await createTestUser({
      email: "blocked@example.com",
      password: "Password123",
      status: "blocked"
    });

    await expect(authService.loginUser("blocked@example.com", "Password123")).rejects.toMatchObject({
      statusCode: 403,
      message: "Your account has been blocked"
    });
  });

  it("refreshes a valid user session", async () => {
    const registered = await authService.registerUser({
      fullName: "Refresh User",
      email: "refresh@example.com",
      password: "Password123",
      role: "seller"
    });

    const refreshed = await authService.refreshUserSession(registered.refreshToken);

    expect(refreshed.accessToken).toEqual(expect.any(String));
    expect(refreshed.refreshToken).toBe(registered.refreshToken);
    expect(refreshed.user).toMatchObject({
      email: "refresh@example.com",
      role: "seller"
    });
    expect(refreshed.user.passwordHash).toBeUndefined();
  });
});
