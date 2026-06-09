const mongoose = require("mongoose");

async function connectDB() {
  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    // Fail fast so the server does not start with a missing database URI.
    throw new Error("MONGODB_URI is not defined");
  }

  // Establish the MongoDB connection before the HTTP server starts listening.
  await mongoose.connect(mongoUri);
  console.log("MongoDB connected successfully");
}

module.exports = connectDB;
