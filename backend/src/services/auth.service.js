const User = require("../models/User");
const { comparePassword } = require("../utils/password");
const {
  createAccessToken,
  createRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
} = require("../utils/token");
const { createHttpError } = require("../utils/httpError");

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
  const newRefreshToken = createRefreshToken(tokenPayload);

  user.refreshToken = newRefreshToken;
  await user.save();

  return {
    user: user.toJSON(),
    accessToken,
    refreshToken: newRefreshToken,
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

async function getCurrentUser(accessToken) {
  if (!accessToken) {
    throw createHttpError(401, "Access token is required");
  }

  let payload;

  try {
    payload = verifyAccessToken(accessToken);
  } catch (_error) {
    throw createHttpError(401, "Invalid access token");
  }

  const user = await User.findById(payload.userId);

  if (!user) {
    throw createHttpError(401, "Invalid access token");
  }

  if (user.status === "blocked") {
    throw createHttpError(403, "Your account has been blocked");
  }

  return user.toJSON();
}

module.exports = {
  loginUser,
  refreshUserSession,
  logoutUser,
  getCurrentUser,
};
