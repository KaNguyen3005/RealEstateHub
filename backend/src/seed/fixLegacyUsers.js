const path = require("path");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

const connectDB = require("../config/db");
const User = require("../models/User");

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

function toDisplayName(email) {
  const localPart = String(email || "")
    .split("@")[0]
    .replace(/[._-]+/g, " ")
    .trim();

  if (!localPart) {
    return "Legacy User";
  }

  return localPart
    .split(/\s+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

async function fixLegacyUsers() {
  await connectDB();

  const legacyUsers = await User.find({
    $or: [
      { role: { $nin: ["admin", "seller", "user"] } },
      { fullName: { $exists: false } },
      { fullName: "" },
    ],
  }).select("_id email fullName role");

  if (legacyUsers.length === 0) {
    console.log("No legacy users found.");
    return;
  }

  for (const user of legacyUsers) {
    const nextFullName = user.fullName && String(user.fullName).trim() ? user.fullName : toDisplayName(user.email);
    const nextRole = ["admin", "seller", "user"].includes(user.role) ? user.role : "seller";

    await User.updateOne(
      { _id: user._id },
      {
        $set: {
          fullName: nextFullName,
          role: nextRole,
        },
      }
    );

    console.log(`Fixed user ${user.email}: role=${nextRole}, fullName=${nextFullName}`);
  }
}

fixLegacyUsers()
  .catch((error) => {
    console.error("Failed to fix legacy users:", error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
