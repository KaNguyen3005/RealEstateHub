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

module.exports = {
  extractBearerToken,
};
