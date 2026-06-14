const User = require("../models/User");
const { comparePassword, hashPassword } = require("../utils/password");
const {
  createAccessToken,
  createRefreshToken,
  verifyRefreshToken,
} = require("../utils/token");
const { createHttpError } = require("../utils/httpError");

async function registerUser(input) {
  const fullName = String(input?.fullName || "").trim();
  const email = String(input?.email || "").trim().toLowerCase();
  const password = String(input?.password || "");
  const role = input?.role || "user";

  if (!fullName || !email || !password) {
    throw createHttpError(400, "Full name, email and password are required");
  }

  if (fullName.length < 2) {
    throw createHttpError(400, "Full name must be at least 2 characters long");
  }

  if (password.length < 6) {
    throw createHttpError(400, "Password must be at least 6 characters long");
  }

  if (!["user", "seller"].includes(role)) {
    throw createHttpError(400, "Role must be user or seller");
  }

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw createHttpError(409, "Email already exists");
  }

  const passwordHash = await hashPassword(password);

  const user = await User.create({
    fullName,
    email,
    passwordHash,
    role,
    status: "active",
  });

  const tokenPayload = {
    userId: String(user._id),
    role: user.role,
  };

  const accessToken = createAccessToken(tokenPayload);
  const refreshToken = createRefreshToken(tokenPayload);

  user.refreshToken = refreshToken;
  await user.save();

  return {
    user: user.toJSON(),
    accessToken,
    refreshToken,
  };
}

async function loginUser(email, password) {
  const normalizedEmail = String(email || "").trim().toLowerCase();

  if (!normalizedEmail || !password) {
    throw createHttpError(400, "Email and password are required");
  }

  const user = await User.findOne({ email: normalizedEmail });

  if (!user) {
    throw createHttpError(401, "Invalid email or password");
  }

  if (user.status === "blocked") {
    throw createHttpError(403, "Your account has been blocked");
  }

  const isPasswordValid = await comparePassword(password, user.passwordHash);

  if (!isPasswordValid) {
    throw createHttpError(401, "Invalid email or password");
  }

  const tokenPayload = {
    userId: String(user._id),
    role: user.role,
  };

  const accessToken = createAccessToken(tokenPayload);
  const refreshToken = createRefreshToken(tokenPayload);

  user.refreshToken = refreshToken;
  await user.save();

  const userData = user.toJSON();

  return {
    user: userData,
    accessToken,
    refreshToken,
  };
}

async function refreshUserSession(refreshToken) {
  if (!refreshToken) {
    throw createHttpError(401, "Refresh token is required");
  }

  let payload;

  try {
    payload = verifyRefreshToken(refreshToken);
  } catch (_error) {
    throw createHttpError(401, "Invalid refresh token");
  }

  const user = await User.findById(payload.userId);

  if (!user) {
    throw createHttpError(401, "Invalid refresh token");
  }

  if (user.status === "blocked") {
    throw createHttpError(403, "Your account has been blocked");
  }

  if (user.refreshToken !== refreshToken) {
    throw createHttpError(401, "Invalid refresh token");
  }

  const tokenPayload = {
    userId: String(user._id),
    role: user.role,
  };

  const accessToken = createAccessToken(tokenPayload);

  return {
    user: user.toJSON(),
    accessToken,
    refreshToken,
  };
}

async function logoutUser(refreshToken) {
  if (!refreshToken) {
    return { revoked: false };
  }

  let payload;

  try {
    payload = verifyRefreshToken(refreshToken);
  } catch (_error) {
    return { revoked: false };
  }

  const user = await User.findById(payload.userId);

  if (!user || user.refreshToken !== refreshToken) {
    return { revoked: false };
  }

  user.refreshToken = null;
  await user.save();

  return { revoked: true };
}

module.exports = {
  registerUser,
  loginUser,
  refreshUserSession,
  logoutUser,
};
