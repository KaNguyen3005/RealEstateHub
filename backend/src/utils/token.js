const jwt = require("jsonwebtoken");

function getTokenConfig() {
  const accessSecret = process.env.JWT_ACCESS_SECRET;
  const refreshSecret = process.env.JWT_REFRESH_SECRET;

  if (!accessSecret || !refreshSecret) {
    throw new Error("JWT_ACCESS_SECRET and JWT_REFRESH_SECRET must be defined");
  }

  return {
    accessSecret,
    refreshSecret,
    accessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN || "15m",
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "7d",
  };
}

function createAccessToken(payload) {
  const { accessSecret, accessExpiresIn } = getTokenConfig();
  return jwt.sign(payload, accessSecret, { expiresIn: accessExpiresIn });
}

function createRefreshToken(payload) {
  const { refreshSecret, refreshExpiresIn } = getTokenConfig();
  return jwt.sign(payload, refreshSecret, { expiresIn: refreshExpiresIn });
}

function verifyAccessToken(token) {
  const { accessSecret } = getTokenConfig();
  return jwt.verify(token, accessSecret);
}

function verifyRefreshToken(token) {
  const { refreshSecret } = getTokenConfig();
  return jwt.verify(token, refreshSecret);
}

module.exports = {
  createAccessToken,
  createRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
};
