function errorMiddleware(err, req, res, next) {
  // Use the explicit status code when available; otherwise fall back to 500.
  const statusCode = err.statusCode || err.status || 500;
  const isServerError = statusCode >= 500;

  // Keep the payload consistent across controllers and middleware.
  const response = {
    success: false,
    message: isServerError ? "Internal server error" : err.message || "Request failed"
  };

  if (typeof err.errors !== "undefined") {
    response.errors = err.errors;
  }

  if (!isServerError && typeof err.errors === "undefined" && err.details) {
    response.errors = err.details;
  }

  // Log stack traces only outside production so user responses stay clean.
  if (process.env.NODE_ENV !== "production" && isServerError && err.stack) {
    console.error(err.stack);
  } else if (isServerError) {
    console.error(err.message);
  }

  res.status(statusCode).json(response);
}

module.exports = errorMiddleware;
