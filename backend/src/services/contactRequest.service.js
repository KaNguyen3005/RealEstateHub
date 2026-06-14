const mongoose = require("mongoose");
const ContactRequest = require("../models/ContactRequest");
const Property = require("../models/Property");
const { createHttpError } = require("../utils/httpError");

function isValidObjectId(value) {
  return mongoose.Types.ObjectId.isValid(String(value || ""));
}

function normalizeStringField(value, fieldName, { minLength = 1, maxLength } = {}) {
  const normalized = String(value || "").trim();

  if (!normalized) {
    throw createHttpError(400, `${fieldName} is required`);
  }

  if (normalized.length < minLength) {
    throw createHttpError(400, `${fieldName} must be at least ${minLength} characters`);
  }

  if (typeof maxLength === "number" && normalized.length > maxLength) {
    throw createHttpError(400, `${fieldName} must not exceed ${maxLength} characters`);
  }

  return normalized;
}

function normalizeContactRequestPayload(payload = {}) {
  const propertyId = String(payload.propertyId || "").trim();

  if (!propertyId) {
    throw createHttpError(400, "propertyId is required");
  }

  if (!isValidObjectId(propertyId)) {
    throw createHttpError(400, "Invalid propertyId");
  }

  const email = normalizeStringField(payload.email, "email", {
    minLength: 5,
    maxLength: 160,
  }).toLowerCase();

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw createHttpError(400, "email is invalid");
  }

  return {
    propertyId,
    name: normalizeStringField(payload.name, "name", { minLength: 2, maxLength: 120 }),
    email,
    phone: normalizeStringField(payload.phone, "phone", { minLength: 8, maxLength: 30 }),
    message: normalizeStringField(payload.message, "message", { minLength: 10, maxLength: 2000 }),
  };
}

async function createContactRequest(payload, currentUser) {
  const normalizedPayload = normalizeContactRequestPayload(payload);

  const property = await Property.findOne({
    _id: normalizedPayload.propertyId,
    status: "approved",
  }).select("_id status");

  if (!property) {
    const propertyExists = await Property.exists({ _id: normalizedPayload.propertyId });

    if (!propertyExists) {
      throw createHttpError(404, "Property not found");
    }

    throw createHttpError(400, "Property is not available for contact requests");
  }

  const contactRequest = await ContactRequest.create({
    ...normalizedPayload,
    propertyId: property._id,
    ...(currentUser?._id && isValidObjectId(currentUser._id)
      ? { userId: currentUser._id }
      : {}),
    status: "new",
  });

  return contactRequest;
}

async function getMyContactRequests(userIdInput) {
  const userId = String(userIdInput || "").trim();

  if (!userId || !isValidObjectId(userId)) {
    throw createHttpError(401, "Authentication is required");
  }

  const requests = await ContactRequest.find({ userId })
    .sort({ createdAt: -1 })
    .populate({
      path: "propertyId",
      select: "title price status images city district ward",
    });

  return requests;
}

module.exports = {
  createContactRequest,
  getMyContactRequests,
  normalizeContactRequestPayload,
};
