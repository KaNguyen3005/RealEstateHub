const path = require("path");
const crypto = require("crypto");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const connectDB = require("../config/db");
const User = require("../models/User");

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const ADMIN_EMAIL = process.env.ADMIN_SEED_EMAIL || "admin@realestatehub.local";
const ADMIN_PASSWORD = process.env.ADMIN_SEED_PASSWORD || "Admin@123";

async function hashPassword(password) {
  // Dùng bcrypt nếu có sẵn, còn không thì fallback để seed vẫn chạy được trong giai đoạn đầu.
  try {
    const bcrypt = require("bcryptjs");
    return await bcrypt.hash(password, 10);
  } catch (_error) {
    return crypto.createHash("sha256").update(password).digest("hex");
  }
}

async function seedAdmin() {
  await connectDB();

  const passwordHash = await hashPassword(ADMIN_PASSWORD);
  const adminData = {
    fullName: "RealEstateHub Admin",
    email: ADMIN_EMAIL,
    passwordHash,
    phone: "0000000000",
    role: "admin",
    avatar: "",
    status: "active",
  };

  const admin = await User.findOneAndUpdate(
    { email: ADMIN_EMAIL },
    { $set: adminData },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  console.log("Admin account seeded successfully");
  console.log(`- Email: ${admin.email}`);
  console.log(`- Role: ${admin.role}`);
}

seedAdmin()
  .catch((error) => {
    console.error("Failed to seed admin account:", error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
