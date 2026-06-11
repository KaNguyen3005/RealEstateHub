const mongoose = require("mongoose");
const Message = require("../models/Message");
const Conversation = require("../models/Conversation");
const { createHttpError } = require("../utils/httpError");
const {
  getConversationById,
  isPropertyClosedForChat,
} = require("./conversation.service");

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

  return normalized;
}

function normalizeContent(content) {
  const normalized = String(content || "").trim();

  if (!normalized) {
    throw createHttpError(400, "content is required");
  }

  if (normalized.length > 2000) {
    throw createHttpError(400, "content must not exceed 2000 characters");
  }

  return normalized;
}

function normalizeCurrentUserId(currentUser) {
  const userId = String(currentUser?._id || currentUser?.userId || "").trim();

  if (!userId) {
    throw createHttpError(401, "Authentication is required");
  }

  if (!isValidObjectId(userId)) {
    throw createHttpError(401, "Authentication is required");
  }

  return userId;
}

async function assertParticipant(conversation, userId) {
  const participantIds = (conversation.participants || []).map((participant) =>
    String(participant?._id || participant)
  );

  if (!participantIds.includes(String(userId))) {
    throw createHttpError(403, "You are not a participant of this conversation");
  }
}

async function assertConversationIsOpen(conversation) {
  const property = conversation.propertyId;
  const propertyStatus = String(property?.status || "").trim();

  if (isPropertyClosedForChat(propertyStatus)) {
    throw createHttpError(409, "Property is closed for chat");
  }

  if (propertyStatus && propertyStatus !== "approved") {
    throw createHttpError(400, "Property is not approved");
  }
}

async function populateMessage(message) {
  return message.populate([
    {
      path: "senderId",
      select: "fullName",
    },
  ]);
}

async function createMessage(conversationIdInput, contentInput, currentUser) {
  const conversationId = normalizeObjectId(conversationIdInput, "conversation id");
  const senderId = normalizeCurrentUserId(currentUser);
  const content = normalizeContent(contentInput);

  const conversation = await getConversationById(conversationId);

  await assertParticipant(conversation, senderId);
  await assertConversationIsOpen(conversation);

  const message = await Message.create({
    conversationId,
    senderId,
    content,
    isRead: false,
  });

  await Conversation.findByIdAndUpdate(conversationId, {
    lastMessage: content,
  });

  return populateMessage(message);
}

async function getMessagesByConversation(conversationIdInput, currentUser) {
  const conversationId = normalizeObjectId(conversationIdInput, "conversation id");
  const senderId = normalizeCurrentUserId(currentUser);
  const conversation = await getConversationById(conversationId);

  await assertParticipant(conversation, senderId);

  const messages = await Message.find({ conversationId })
    .sort({ createdAt: 1 })
    .populate({
      path: "senderId",
      select: "fullName",
    });

  return messages;
}

module.exports = {
  createMessage,
  getMessagesByConversation,
  normalizeContent,
};
