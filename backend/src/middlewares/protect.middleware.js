const User = require("../models/User");
const { verifyAccessToken } = require("../utils/token");
const { createHttpError } = require("../utils/httpError");

function extractBearerToken(authorizationHeader) {
  if (!authorizationHeader) {
    return null;
  }

  const [scheme, token] = String(authorizationHeader).split(" ");

  if (scheme !== "Bearer" || !token) {
    return null;
  }

  return token;
}

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

  const user = await User.findById(payload.userId);

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

  return next();
}

module.exports = protect;
