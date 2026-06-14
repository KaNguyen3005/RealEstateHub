const mongoose = require("mongoose");
const Favorite = require("../models/Favorite");
const Property = require("../models/Property");
const { createHttpError } = require("../utils/httpError");

function isValidObjectId(value) {
  return mongoose.Types.ObjectId.isValid(String(value || ""));
}

async function ensureApprovedProperty(propertyId) {
  if (!isValidObjectId(propertyId)) {
    throw createHttpError(400, "Invalid property id");
  }

  const property = await Property.findById(propertyId).select("_id status");

  if (!property) {
    throw createHttpError(404, "Property not found");
  }

  if (property.status !== "approved") {
    throw createHttpError(400, "Property is not available for favorites");
  }

  return property;
}

async function getUserFavorites(userId) {
  if (!isValidObjectId(userId)) {
    throw createHttpError(401, "Invalid user");
  }

  const favorites = await Favorite.find({ userId })
    .sort({ createdAt: -1 })
    .populate({
      path: "propertyId",
      match: { status: "approved" },
      populate: {
        path: "ownerId",
        select: "fullName email role avatar",
      },
    });

  const items = favorites
    .map((favorite) => favorite.propertyId)
    .filter(Boolean);

  return {
    items,
    favoriteIds: items.map((property) => String(property._id)),
  };
}

async function addFavorite(userId, propertyId) {
  if (!isValidObjectId(userId)) {
    throw createHttpError(401, "Invalid user");
  }

  const property = await ensureApprovedProperty(propertyId);
  const existingFavorite = await Favorite.findOne({
    userId,
    propertyId: property._id,
  });

  if (existingFavorite) {
    throw createHttpError(409, "Property is already in favorites");
  }

  await Favorite.create({
    userId,
    propertyId: property._id,
  });

  return property;
}

async function removeFavorite(userId, propertyId) {
  if (!isValidObjectId(userId)) {
    throw createHttpError(401, "Invalid user");
  }

  if (!isValidObjectId(propertyId)) {
    throw createHttpError(400, "Invalid property id");
  }

  const result = await Favorite.findOneAndDelete({
    userId,
    propertyId,
  });

  return {
    removed: Boolean(result),
    propertyId: String(propertyId),
  };
}

module.exports = {
  getUserFavorites,
  addFavorite,
  removeFavorite,
};
