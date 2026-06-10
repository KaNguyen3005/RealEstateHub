const PROPERTY_STATUS_VALUES = ["pending", "approved", "rejected", "hidden", "sold", "rented"];
const PROPERTY_CLOSED_STATUSES = ["sold", "rented"];

const PROPERTY_CLOSED_LABELS = {
  sold: "Đã bán",
  rented: "Đã cho thuê",
};

function isPropertyClosedStatus(status) {
  return PROPERTY_CLOSED_STATUSES.includes(status);
}

function getPropertyClosedLabel(status) {
  return PROPERTY_CLOSED_LABELS[status] || null;
}

function createPropertyChatClosedError(propertyStatus) {
  const label = getPropertyClosedLabel(propertyStatus) || "Đã đóng";
  const error = new Error(`Cannot chat because this property is ${label.toLowerCase()}`);
  error.statusCode = 409;
  error.code = "PROPERTY_CHAT_CLOSED";
  error.details = {
    propertyStatus,
    label,
  };
  return error;
}

function createPropertyNotFoundError() {
  const error = new Error("Property not found");
  error.statusCode = 404;
  error.code = "PROPERTY_NOT_FOUND";
  return error;
}

function createConversationPropertyNotApprovedError(propertyStatus) {
  const error = new Error("Conversation can only be created for approved properties");
  error.statusCode = 409;
  error.code = "PROPERTY_NOT_APPROVED";
  error.details = {
    propertyStatus,
  };
  return error;
}

module.exports = {
  PROPERTY_STATUS_VALUES,
  PROPERTY_CLOSED_STATUSES,
  isPropertyClosedStatus,
  getPropertyClosedLabel,
  createPropertyChatClosedError,
  createPropertyNotFoundError,
  createConversationPropertyNotApprovedError,
};
