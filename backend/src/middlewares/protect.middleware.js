const User = require("../models/User");
const { verifyAccessToken } = require("../utils/token");
const { createHttpError } = require("../utils/httpError");
const { extractBearerToken } = require("../utils/authHeader");

async function protect(req, res, next) {
  const accessToken = extractBearerToken(req.headers.authorization);

  if (!accessToken) {
    return next(createHttpError(401, "Access token is required"));
  }

  let payload;

  try {
    payload = verifyAccessToken(accessToken);
  } catch (_error) {
    return next(createHttpError(401, "Invalid access token"));
  }

  let user;

  try {
    user = await User.findById(payload.userId);
  } catch (error) {
    return next(
      error.statusCode ? error : createHttpError(500, "Failed to verify access token")
    );
  }

  if (!user) {
    return next(createHttpError(401, "Invalid access token"));
  }

  if (user.status === "blocked") {
    return next(createHttpError(403, "Your account has been blocked"));
  }

  req.user = user.toJSON();
  req.userToken = {
    userId: payload.userId,
    role: payload.role,
  };
  req.auth = req.userToken;

  return next();
}

module.exports = protect;
