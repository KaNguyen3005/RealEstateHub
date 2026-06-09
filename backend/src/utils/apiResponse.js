function createApiResponse({ success, message, data, errors }) {
  const response = {
    success,
    message
  };

  if (typeof data !== "undefined") {
    response.data = data;
  }

  if (typeof errors !== "undefined") {
    response.errors = errors;
  }

  return response;
}

function successResponse(message, data) {
  return createApiResponse({
    success: true,
    message,
    data
  });
}

function errorResponse(message, errors) {
  return createApiResponse({
    success: false,
    message,
    errors
  });
}

module.exports = {
  createApiResponse,
  successResponse,
  errorResponse
};
