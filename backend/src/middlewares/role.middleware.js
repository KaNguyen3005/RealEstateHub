const { createHttpError } = require("../utils/httpError");

function allowRoles(...roles) {
  const allowedRoles = roles.flat().filter(Boolean);

  return function allowRolesMiddleware(req, res, next) {
    if (!req.user) {
      return next(createHttpError(401, "Authentication required"));
    }

    if (allowedRoles.length === 0) {
      return next(createHttpError(500, "Allowed roles are required"));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(createHttpError(403, "Forbidden"));
    }

    return next();
  };
}

module.exports = allowRoles;
