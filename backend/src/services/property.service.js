const mongoose = require("mongoose");
const Property = require("../models/Property");
const { createHttpError } = require("../utils/httpError");

const PROPERTY_ALLOWED_STATUSES = ["pending", "approved", "rejected", "hidden", "sold", "rented"];
const PROPERTY_UPDATABLE_FIELDS = [
  "title",
  "description",
  "type",
  "purpose",
  "price",
  "area",
  "bedrooms",
  "bathrooms",
  "address",
  "city",
  "district",
  "ward",
  "latitude",
  "longitude",
  "images",
  "amenities",
];

function isValidObjectId(value) {
  return mongoose.Types.ObjectId.isValid(String(value || ""));
}

function trimString(value) {
  return String(value ?? "").trim();
}

function stripVietnameseAccents(value) {
  return String(value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function buildSlug(title, idSuffix) {
  const normalizedTitle = stripVietnameseAccents(title)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  const base = normalizedTitle || "property";
  return `${base}-${idSuffix}`;
}

function parseNumber(value, fieldName) {
  if (value === undefined || value === null || value === "") {
    return undefined;
  }

  const parsed = Number(value);

  if (!Number.isFinite(parsed)) {
    throw createHttpError(400, `${fieldName} must be a valid number`);
  }

  return parsed;
}

function normalizeStringArray(value, fieldName, { required = false } = {}) {
  if (value === undefined || value === null) {
    if (required) {
      throw createHttpError(400, `${fieldName} is required`);
    }

    return undefined;
  }

  if (!Array.isArray(value)) {
    throw createHttpError(400, `${fieldName} must be an array`);
  }

  const items = value.map((item) => trimString(item)).filter(Boolean);

  if (required && items.length === 0) {
    throw createHttpError(400, `${fieldName} cannot be empty`);
  }

  return items;
}

function normalizePropertyPayload(payload, { requireAllFields = false } = {}) {
  const normalized = {};
  const requiredFields = [
    "title",
    "description",
    "type",
    "purpose",
    "price",
    "area",
    "address",
    "city",
    "latitude",
    "longitude",
    "images",
  ];

  for (const field of requiredFields) {
    if (requireAllFields && (payload?.[field] === undefined || payload?.[field] === null || payload?.[field] === "")) {
      throw createHttpError(400, `${field} is required`);
    }
  }

  if (payload?.title !== undefined) {
    normalized.title = trimString(payload.title);
    if (normalized.title.length < 5) {
      throw createHttpError(400, "title must be at least 5 characters long");
    }
  }

  if (payload?.description !== undefined) {
    normalized.description = trimString(payload.description);
    if (normalized.description.length < 20) {
      throw createHttpError(400, "description must be at least 20 characters long");
    }
  }

  if (payload?.type !== undefined) {
    normalized.type = trimString(payload.type);
    if (!["apartment", "house", "land", "villa", "office"].includes(normalized.type)) {
      throw createHttpError(400, "type must be apartment, house, land, villa or office");
    }
  }

  if (payload?.purpose !== undefined) {
    normalized.purpose = trimString(payload.purpose);
    if (!["sale", "rent"].includes(normalized.purpose)) {
      throw createHttpError(400, "purpose must be sale or rent");
    }
  }

  if (payload?.price !== undefined) {
    normalized.price = parseNumber(payload.price, "price");
    if (normalized.price <= 0) {
      throw createHttpError(400, "price must be greater than 0");
    }
  }

  if (payload?.area !== undefined) {
    normalized.area = parseNumber(payload.area, "area");
    if (normalized.area <= 0) {
      throw createHttpError(400, "area must be greater than 0");
    }
  }

  if (payload?.bedrooms !== undefined) {
    normalized.bedrooms = parseNumber(payload.bedrooms, "bedrooms");
    if (normalized.bedrooms < 0) {
      throw createHttpError(400, "bedrooms must be greater than or equal to 0");
    }
  }

  if (payload?.bathrooms !== undefined) {
    normalized.bathrooms = parseNumber(payload.bathrooms, "bathrooms");
    if (normalized.bathrooms < 0) {
      throw createHttpError(400, "bathrooms must be greater than or equal to 0");
    }
  }

  if (payload?.address !== undefined) {
    normalized.address = trimString(payload.address);
    if (normalized.address.length < 5) {
      throw createHttpError(400, "address must be at least 5 characters long");
    }
  }

  if (payload?.city !== undefined) {
    normalized.city = trimString(payload.city);
    if (!normalized.city) {
      throw createHttpError(400, "city is required");
    }
  }

  if (payload?.district !== undefined) {
    normalized.district = trimString(payload.district);
  }

  if (payload?.ward !== undefined) {
    normalized.ward = trimString(payload.ward);
  }

  if (payload?.latitude !== undefined) {
    normalized.latitude = parseNumber(payload.latitude, "latitude");
  }

  if (payload?.longitude !== undefined) {
    normalized.longitude = parseNumber(payload.longitude, "longitude");
  }

  if (payload?.images !== undefined) {
    normalized.images = normalizeStringArray(payload.images, "images", { required: true });

    if (normalized.images.length > 10) {
      throw createHttpError(400, "images must contain between 1 and 10 items");
    }
  }

  if (payload?.amenities !== undefined) {
    normalized.amenities = normalizeStringArray(payload.amenities, "amenities");
  }

  return normalized;
}

function canViewProperty(user, property) {
  if (!user) {
    return property.status === "approved";
  }

  if (user.role === "admin") {
    return true;
  }

  if (user.role === "seller") {
    return String(property.ownerId?._id || property.ownerId) === String(user._id);
  }

  return property.status === "approved";
}

function canModifyProperty(user, property) {
  if (!user) {
    return false;
  }

  if (user.role === "admin") {
    return true;
  }

  return String(property.ownerId?._id || property.ownerId) === String(user._id);
}

function buildPropertyQuery(query = {}) {
  const filter = {
    status: "approved",
  };

  if (query.city) {
    const city = trimString(query.city);
    if (city) {
      filter.city = city;
    }
  }

  if (query.district) {
    const district = trimString(query.district);
    if (district) {
      filter.district = district;
    }
  }

  if (query.type) {
    const type = trimString(query.type);
    if (type) {
      filter.type = type;
    }
  }

  if (query.purpose) {
    const purpose = trimString(query.purpose);
    if (purpose) {
      filter.purpose = purpose;
    }
  }

  if (query.minPrice || query.maxPrice) {
    filter.price = {};

    if (query.minPrice) {
      filter.price.$gte = Number(query.minPrice);
    }

    if (query.maxPrice) {
      filter.price.$lte = Number(query.maxPrice);
    }
  }

  if (query.minArea || query.maxArea) {
    filter.area = {};

    if (query.minArea) {
      filter.area.$gte = Number(query.minArea);
    }

    if (query.maxArea) {
      filter.area.$lte = Number(query.maxArea);
    }
  }

  if (query.keyword) {
    filter.$text = {
      $search: trimString(query.keyword),
    };
  }

  return filter;
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

async function getProperties(query, currentUser) {
  const isMineQuery = String(query?.mine || "").toLowerCase() === "1";
  const filter = isMineQuery
    ? {
        ownerId: currentUser?._id,
      }
    : buildPropertyQuery(query);

  if (isMineQuery) {
    if (!currentUser) {
      throw createHttpError(401, "Authentication is required");
    }

    if (!["seller", "admin"].includes(currentUser.role)) {
      throw createHttpError(403, "Only sellers and admins can view own properties");
    }

    if (query.status) {
      filter.status = trimString(query.status);
    }
  }

  const { page, limit, skip } = parsePagination(query);

  const [items, totalItems] = await Promise.all([
    Property.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("ownerId", "fullName email role avatar"),
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

async function getPropertiesForCompare(ids, currentUser) {
  const rawIds = String(ids || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

  if (rawIds.length === 0) {
    return {
      items: [],
    };
  }

  if (rawIds.length > 3) {
    throw createHttpError(400, "You can compare up to 3 properties");
  }

  const validIds = rawIds.filter((id) => isValidObjectId(id));

  if (validIds.length === 0) {
    return {
      items: [],
    };
  }

  const properties = await Property.find({ _id: { $in: validIds } }).populate(
    "ownerId",
    "fullName email role avatar"
  );

  const propertyById = new Map(properties.map((property) => [String(property._id), property]));

  const items = rawIds
    .map((id) => propertyById.get(id))
    .filter((property) => property && canViewProperty(currentUser, property));

  return {
    items,
  };
}

async function getPropertyById(id, currentUser) {
  if (!isValidObjectId(id)) {
    throw createHttpError(400, "Invalid property id");
  }

  const property = await Property.findById(id).populate("ownerId", "fullName email role avatar");

  if (!property) {
    throw createHttpError(404, "Property not found");
  }

  if (!canViewProperty(currentUser, property)) {
    throw createHttpError(404, "Property not found");
  }

  return property;
}

async function createProperty(userId, payload) {
  if (!isValidObjectId(userId)) {
    throw createHttpError(401, "Invalid user");
  }

  const normalizedPayload = normalizePropertyPayload(payload, { requireAllFields: true });

  const property = await Property.create({
    ...normalizedPayload,
    ownerId: userId,
    status: "pending",
  });

  property.slug = buildSlug(property.title, String(property._id).slice(-6));
  await property.save();

  return await property.populate("ownerId", "fullName email role avatar");
}

async function updateProperty(user, propertyId, payload) {
  if (!isValidObjectId(propertyId)) {
    throw createHttpError(400, "Invalid property id");
  }

  const property = await Property.findById(propertyId);

  if (!property) {
    throw createHttpError(404, "Property not found");
  }

  if (!canModifyProperty(user, property)) {
    throw createHttpError(403, "Forbidden");
  }

  const normalizedPayload = normalizePropertyPayload(payload, { requireAllFields: false });
  if (Object.keys(normalizedPayload).length === 0) {
    throw createHttpError(400, "At least one valid property field is required");
  }
  const isSellerEditingOwnProperty = user?.role === "seller";
  const wasApproved = property.status === "approved";

  PROPERTY_UPDATABLE_FIELDS.forEach((field) => {
    if (typeof normalizedPayload[field] !== "undefined") {
      property[field] = normalizedPayload[field];
    }
  });

  if (typeof normalizedPayload.title !== "undefined") {
    property.slug = buildSlug(property.title, String(property._id).slice(-6));
  }

  if (isSellerEditingOwnProperty && wasApproved) {
    property.status = "pending";
  }

  await property.save();

  return await property.populate("ownerId", "fullName email role avatar");
}

async function deleteProperty(user, propertyId) {
  if (!isValidObjectId(propertyId)) {
    throw createHttpError(400, "Invalid property id");
  }

  const property = await Property.findById(propertyId);

  if (!property) {
    throw createHttpError(404, "Property not found");
  }

  if (!canModifyProperty(user, property)) {
    throw createHttpError(403, "Forbidden");
  }

  await property.populate("ownerId", "fullName email role avatar");
  const deletedProperty = property.toJSON();
  await property.deleteOne();

  return deletedProperty;
}

async function updatePropertyStatus(propertyId, status) {
  if (!isValidObjectId(propertyId)) {
    throw createHttpError(400, "Invalid property id");
  }

  const nextStatus = trimString(status);

  if (!PROPERTY_ALLOWED_STATUSES.includes(nextStatus)) {
    throw createHttpError(400, "Invalid property status");
  }

  const property = await Property.findById(propertyId);

  if (!property) {
    throw createHttpError(404, "Property not found");
  }

  property.status = nextStatus;
  await property.save();

  return await property.populate("ownerId", "fullName email role avatar");
}

module.exports = {
  getProperties,
  getPropertiesForCompare,
  getPropertyById,
  createProperty,
  updateProperty,
  deleteProperty,
  updatePropertyStatus,
  canViewProperty,
  canModifyProperty,
  buildPropertyQuery,
};
