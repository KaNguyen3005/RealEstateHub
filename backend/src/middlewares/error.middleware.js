const { errorResponse } = require("../utils/apiResponse");

function errorMiddleware(err, req, res, next) {
  // Use the explicit status code when available; otherwise fall back to 500.
  const statusCode = err.statusCode || err.status || 500;
  const isServerError = statusCode >= 500;

  // Keep the payload consistent across controllers and middleware.
  const response = errorResponse(
    isServerError ? "Internal server error" : err.message || "Request failed",
    typeof err.errors !== "undefined"
      ? err.errors
      : !isServerError && typeof err.details !== "undefined"
        ? err.details
        : undefined
  );

  // Log stack traces only outside production so user responses stay clean.
  if (process.env.NODE_ENV !== "production" && isServerError && err.stack) {
    console.error(err.stack);
  } else if (isServerError) {
    console.error(err.message);
  }

  res.status(statusCode).json(response);
}

module.exports = errorMiddleware;
