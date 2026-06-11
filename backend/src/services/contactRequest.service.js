const mongoose = require("mongoose");
const ContactRequest = require("../models/ContactRequest");
const Property = require("../models/Property");
const { createHttpError } = require("../utils/httpError");

function trimString(value) {
  return String(value ?? "").trim();
}

function isValidObjectId(value) {
  return mongoose.Types.ObjectId.isValid(String(value || ""));
}

function normalizeContactRequestPayload(payload = {}) {
  const propertyId = trimString(payload.propertyId);
  const name = trimString(payload.name);
  const email = trimString(payload.email).toLowerCase();
  const phone = trimString(payload.phone);
  const message = trimString(payload.message);

  if (!propertyId) {
    throw createHttpError(400, "propertyId is required");
  }

  if (!isValidObjectId(propertyId)) {
    throw createHttpError(400, "Invalid propertyId");
  }

  if (!name) {
    throw createHttpError(400, "name is required");
  }

  if (name.length < 2) {
    throw createHttpError(400, "name must be at least 2 characters long");
  }

  if (!email) {
    throw createHttpError(400, "email is required");
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw createHttpError(400, "email is invalid");
  }

  if (!phone) {
    throw createHttpError(400, "phone is required");
  }

  if (!message) {
    throw createHttpError(400, "message is required");
  }

  if (message.length < 10) {
    throw createHttpError(400, "message must be at least 10 characters long");
  }

  return {
    propertyId,
    name,
    email,
    phone,
    message,
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

module.exports = {
  createContactRequest,
};
