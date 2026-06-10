const path = require("path");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const connectDB = require("../config/db");
const User = require("../models/User");
const { hashPassword } = require("../utils/password");

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const ADMIN_EMAIL = process.env.ADMIN_SEED_EMAIL || "admin@realestatehub.local";
const ADMIN_PASSWORD = process.env.ADMIN_SEED_PASSWORD || "Admin@123";

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
