const mongoose = require("mongoose");
const Conversation = require("../models/Conversation");
const Property = require("../models/Property");
const { createHttpError } = require("../utils/httpError");

const CLOSED_PROPERTY_STATUSES = ["sold", "rented"];

function isValidObjectId(value) {
  return mongoose.Types.ObjectId.isValid(String(value || ""));
}

function normalizeObjectId(value, fieldName) {
  const normalized = String(value || "").trim();

  if (!normalized) {
    throw createHttpError(400, `${fieldName} is required`);
  }

  if (!isValidObjectId(normalized)) {
    throw createHttpError(400, `Invalid ${fieldName}`);
  }

  return new mongoose.Types.ObjectId(normalized);
}

function normalizeCurrentUserId(currentUser) {
  const userId = String(currentUser?._id || currentUser?.userId || "").trim();

  if (!userId) {
    throw createHttpError(401, "Authentication is required");
  }

  return normalizeObjectId(userId, "user id");
}

function isPropertyClosedForChat(propertyStatus) {
  return CLOSED_PROPERTY_STATUSES.includes(String(propertyStatus || "").trim());
}

function parsePagination(query = {}) {
  const page = Math.max(Number.parseInt(query.page, 10) || 1, 1);
  const limit = Math.min(Math.max(Number.parseInt(query.limit, 10) || 10, 1), 50);

  return {
    page,
    limit,
    skip: (page - 1) * limit,
  };
}

async function populateConversation(conversation) {
  return conversation.populate([
    {
      path: "propertyId",
      select: "title price status purpose type images ownerId",
    },
    {
      path: "participants",
      select: "fullName email role avatar status",
    },
  ]);
}

async function findExistingConversation(propertyId, buyerId, sellerId) {
  return Conversation.findOne({
    propertyId,
    participants: {
      $all: [buyerId, sellerId],
      $size: 2,
    },
  });
}

async function loadChatProperty(propertyIdInput) {
  const propertyId = normalizeObjectId(propertyIdInput, "property id");

  const property = await Property.findById(propertyId).select("_id ownerId status");

  if (!property) {
    throw createHttpError(404, "Property not found");
  }

  if (property.status !== "approved") {
    if (isPropertyClosedForChat(property.status)) {
      throw createHttpError(409, "Property is closed for chat");
    }

    throw createHttpError(400, "Property is not approved");
  }

  return {
    propertyId,
    property,
  };
}

function deriveSellerIdFromProperty(property) {
  if (!property?.ownerId) {
    throw createHttpError(500, "Property owner is missing");
  }

  return normalizeObjectId(property.ownerId, "seller id");
}

async function createOrGetConversation(propertyIdInput, currentUser) {
  const buyerId = normalizeCurrentUserId(currentUser);
  const { propertyId, property } = await loadChatProperty(propertyIdInput);
  const sellerId = deriveSellerIdFromProperty(property);

  if (String(buyerId) === String(sellerId)) {
    throw createHttpError(409, "You cannot start a conversation with yourself");
  }

  const existingConversation = await findExistingConversation(propertyId, buyerId, sellerId);

  if (existingConversation) {
    const populatedExistingConversation = await populateConversation(existingConversation);

    return {
      conversation: populatedExistingConversation,
      created: false,
    };
  }

  const conversation = await Conversation.create({
    propertyId,
    participants: [buyerId, sellerId],
    lastMessage: "",
  });

  const populatedConversation = await populateConversation(conversation);

  return {
    conversation: populatedConversation,
    created: true,
  };
}

async function getConversationById(conversationIdInput) {
  const conversationId = normalizeObjectId(conversationIdInput, "conversation id");

  const conversation = await Conversation.findById(conversationId);

  if (!conversation) {
    throw createHttpError(404, "Conversation not found");
  }

  return populateConversation(conversation);
}

async function getConversationsByUser(userIdInput, query = {}) {
  const userId = normalizeObjectId(userIdInput, "user id");
  const { page, limit, skip } = parsePagination(query);

  const conversations = await Conversation.find({
    participants: userId,
  })
    .sort({ updatedAt: -1 })
    .populate([
      {
        path: "propertyId",
        select: "title price status purpose type images ownerId",
      },
      {
        path: "participants",
        select: "fullName email role avatar status",
      },
    ]);

  const filteredConversations = conversations.filter((conversation) => {
    const propertyStatus = conversation.propertyId?.status;

    return !isPropertyClosedForChat(propertyStatus);
  });

  const totalItems = filteredConversations.length;
  const items = filteredConversations.slice(skip, skip + limit);

  return {
    items,
    page,
    limit,
    totalItems,
    totalPages: Math.max(Math.ceil(totalItems / limit), 1),
  };
}

module.exports = {
  createOrGetConversation,
  getConversationById,
  getConversationsByUser,
  deriveSellerIdFromProperty,
  findExistingConversation,
  loadChatProperty,
  isPropertyClosedForChat,
  parsePagination,
};
