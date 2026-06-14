const mongoose = require("mongoose");
const User = require("../models/User");
const Property = require("../models/Property");
const ContactRequest = require("../models/ContactRequest");
const Conversation = require("../models/Conversation");
const { createHttpError } = require("../utils/httpError");

const USER_ROLES = ["admin", "seller", "user"];
const USER_STATUSES = ["active", "blocked"];
const MODERATION_STATUSES = ["approved", "rejected", "hidden"];

function isValidObjectId(value) {
  return mongoose.Types.ObjectId.isValid(String(value || ""));
}

function trimString(value) {
  return String(value ?? "").trim();
}

function normalizeObjectId(value, fieldName) {
  const normalized = trimString(value);

  if (!normalized || !isValidObjectId(normalized)) {
    throw createHttpError(400, `Invalid ${fieldName}`);
  }

  return normalized;
}

function parsePagination(query = {}) {
  const page = Math.max(Number.parseInt(query.page, 10) || 1, 1);
  const limit = Math.min(Math.max(Number.parseInt(query.limit, 10) || 20, 1), 100);

  return {
    page,
    limit,
    skip: (page - 1) * limit,
  };
}

async function getStats() {
  const [
    totalUsers,
    activeUsers,
    blockedUsers,
    totalProperties,
    pendingProperties,
    approvedProperties,
    totalContactRequests,
    newContactRequests,
    totalConversations,
  ] = await Promise.all([
    User.countDocuments(),
    User.countDocuments({ status: "active" }),
    User.countDocuments({ status: "blocked" }),
    Property.countDocuments(),
    Property.countDocuments({ status: "pending" }),
    Property.countDocuments({ status: "approved" }),
    ContactRequest.countDocuments(),
    ContactRequest.countDocuments({ status: "new" }),
    Conversation.countDocuments(),
  ]);

  return {
    users: {
      total: totalUsers,
      active: activeUsers,
      blocked: blockedUsers,
    },
    properties: {
      total: totalProperties,
      pending: pendingProperties,
      approved: approvedProperties,
    },
    contactRequests: {
      total: totalContactRequests,
      new: newContactRequests,
    },
    conversations: {
      total: totalConversations,
    },
  };
}

async function getUsers(query = {}) {
  const { page, limit, skip } = parsePagination(query);
  const filter = {};
  const role = trimString(query.role);
  const status = trimString(query.status);
  const keyword = trimString(query.keyword);

  if (role) {
    if (!USER_ROLES.includes(role)) {
      throw createHttpError(400, "Invalid role");
    }

    filter.role = role;
  }

  if (status) {
    if (!USER_STATUSES.includes(status)) {
      throw createHttpError(400, "Invalid user status");
    }

    filter.status = status;
  }

  if (keyword) {
    filter.$or = [
      { fullName: { $regex: keyword, $options: "i" } },
      { email: { $regex: keyword, $options: "i" } },
      { phone: { $regex: keyword, $options: "i" } },
    ];
  }

  const [items, totalItems] = await Promise.all([
    User.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    User.countDocuments(filter),
  ]);

  return {
    items,
    page,
    limit,
    totalItems,
    totalPages: Math.max(Math.ceil(totalItems / limit), 1),
  };
}

async function updateUserRole(userIdInput, roleInput) {
  const userId = normalizeObjectId(userIdInput, "user id");
  const role = trimString(roleInput);

  if (!USER_ROLES.includes(role)) {
    throw createHttpError(400, "Invalid role");
  }

  const user = await User.findById(userId);

  if (!user) {
    throw createHttpError(404, "User not found");
  }

  user.role = role;
  await user.save();

  return user;
}

async function updateUserStatus(userIdInput, statusInput, currentAdmin) {
  const userId = normalizeObjectId(userIdInput, "user id");
  const status = trimString(statusInput);

  if (!USER_STATUSES.includes(status)) {
    throw createHttpError(400, "Invalid user status");
  }

  if (status === "blocked" && String(currentAdmin?._id) === userId) {
    throw createHttpError(400, "You cannot block your own admin account");
  }

  const user = await User.findById(userId);

  if (!user) {
    throw createHttpError(404, "User not found");
  }

  user.status = status;
  if (status === "blocked") {
    user.refreshToken = "";
  }

  await user.save();

  return user;
}

async function getPendingProperties(query = {}) {
  const { page, limit, skip } = parsePagination(query);
  const filter = {
    status: "pending",
  };

  const [items, totalItems] = await Promise.all([
    Property.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("ownerId", "fullName email role avatar status"),
    Property.countDocuments(filter),
  ]);

  return {
    items,
    page,
    limit,
    totalItems,
    totalPages: Math.max(Math.ceil(totalItems / limit), 1),
  };
}

async function updatePropertyModerationStatus(propertyIdInput, statusInput) {
  const propertyId = normalizeObjectId(propertyIdInput, "property id");
  const status = trimString(statusInput);

  if (!MODERATION_STATUSES.includes(status)) {
    throw createHttpError(400, "Invalid moderation status");
  }

  const property = await Property.findById(propertyId);

  if (!property) {
    throw createHttpError(404, "Property not found");
  }

  property.status = status;
  await property.save();

  return property.populate("ownerId", "fullName email role avatar status");
}

async function getContactRequests(query = {}) {
  const { page, limit, skip } = parsePagination(query);
  const filter = {};
  const status = trimString(query.status);

  if (status) {
    if (!["new", "contacted", "closed"].includes(status)) {
      throw createHttpError(400, "Invalid contact request status");
    }

    filter.status = status;
  }

  const [items, totalItems] = await Promise.all([
    ContactRequest.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("propertyId", "title price status city district ward")
      .populate("userId", "fullName email role avatar status"),
    ContactRequest.countDocuments(filter),
  ]);

  return {
    items,
    page,
    limit,
    totalItems,
    totalPages: Math.max(Math.ceil(totalItems / limit), 1),
  };
}

module.exports = {
  getStats,
  getUsers,
  updateUserRole,
  updateUserStatus,
  getPendingProperties,
  updatePropertyModerationStatus,
  getContactRequests,
};
