const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const healthRoutes = require("./routes/health.routes");
const authRoutes = require("./routes/auth.routes");
const propertyRoutes = require("./routes/property.routes");
const contactRequestRoutes = require("./routes/contactRequest.routes");
const favoriteRoutes = require("./routes/favorite.routes");
const uploadRoutes = require("./routes/upload.routes");
const conversationRoutes = require("./routes/conversation.routes");
const adminRoutes = require("./routes/admin.routes");
const requestLogger = require("./middlewares/requestLogger.middleware");
const errorMiddleware = require("./middlewares/error.middleware");

function createApp() {
  const app = express();

  app.use(
    cors({
      origin: process.env.CLIENT_URL,
      credentials: true
    })
  );

  app.use(express.json());
  app.use(cookieParser());

  if (process.env.NODE_ENV !== "test") {
    app.use(requestLogger);
  }

  app.get("/", (req, res) => {
    res.json({
      success: true,
      message: "RealEstateHub backend is running"
    });
  });

  app.use("/api/health", healthRoutes);
  app.use("/api/auth", authRoutes);
  app.use("/api/properties", propertyRoutes);
  app.use("/api/uploads", uploadRoutes);
  app.use("/api/favorites", favoriteRoutes);
  app.use("/api/contact-requests", contactRequestRoutes);
  app.use("/api/conversations", conversationRoutes);
  app.use("/api/admin", adminRoutes);
  app.use(errorMiddleware);

  return app;
}

module.exports = {
  createApp
};
