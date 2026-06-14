const mongoose = require("mongoose");

const User = require("../../src/models/User");
const Property = require("../../src/models/Property");
const { hashPassword } = require("../../src/utils/password");

async function createTestUser(overrides = {}) {
  const unique = new mongoose.Types.ObjectId().toString().slice(-8);
  const passwordHash = overrides.passwordHash || (await hashPassword(overrides.password || "Password123"));

  return User.create({
    fullName: overrides.fullName || "Test User",
    email: overrides.email || `user-${unique}@example.com`,
    passwordHash,
    phone: overrides.phone,
    role: overrides.role || "user",
    avatar: overrides.avatar,
    refreshToken: overrides.refreshToken,
    status: overrides.status || "active"
  });
}

function buildPropertyPayload(overrides = {}) {
  const unique = new mongoose.Types.ObjectId().toString().slice(-8);

  return {
    title: `Modern Apartment ${unique}`,
    description: "A modern apartment with enough detail for validation.",
    type: "apartment",
    purpose: "sale",
    price: 1200000000,
    area: 72,
    bedrooms: 2,
    bathrooms: 2,
    address: "123 Test Street",
    city: "Ho Chi Minh",
    district: "District 1",
    ward: "Ben Nghe",
    latitude: 10.7769,
    longitude: 106.7009,
    images: ["https://example.com/property.jpg"],
    amenities: ["Balcony", "Parking"],
    ...overrides
  };
}

async function createTestProperty(ownerId, overrides = {}) {
  return Property.create({
    ...buildPropertyPayload(overrides),
    ownerId
  });
}

module.exports = {
  createTestUser,
  buildPropertyPayload,
  createTestProperty
};
