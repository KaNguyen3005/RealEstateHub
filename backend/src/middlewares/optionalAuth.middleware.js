const User = require("../models/User");
const { verifyAccessToken } = require("../utils/token");
const { extractBearerToken } = require("../utils/authHeader");

async function optionalAuth(req, res, next) {
  const accessToken = extractBearerToken(req.headers.authorization);

  if (!accessToken) {
    return next();
  }

  try {
    const payload = verifyAccessToken(accessToken);
    const user = await User.findById(payload.userId);

    if (user && user.status !== "blocked") {
      req.user = user.toJSON();
      req.userToken = {
        userId: payload.userId,
        role: payload.role,
      };
      req.auth = req.userToken;
    }
  } catch (_error) {
    // Invalid or expired token should not block guest access.
  }

  return next();
}

module.exports = optionalAuth;
