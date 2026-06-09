function asyncHandler(fn) {
  return function asyncHandlerWrapper(req, res, next) {
    // Forward any rejected promise to Express error handling.
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

module.exports = asyncHandler;
