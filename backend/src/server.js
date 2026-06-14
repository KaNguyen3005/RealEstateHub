const path = require("path");
const http = require("http");
const dotenv = require("dotenv");
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

dotenv.config({ path: path.resolve(__dirname, "../.env") });

const connectDB = require("./config/db");
const { initializeSocket } = require("./config/socket");
const healthRoutes = require("./routes/health.routes");
const authRoutes = require("./routes/auth.routes");
const propertyRoutes = require("./routes/property.routes");
const contactRequestRoutes = require("./routes/contactRequest.routes");
const favoriteRoutes = require("./routes/favorite.routes");
const uploadRoutes = require("./routes/upload.routes");
const conversationRoutes = require("./routes/conversation.routes");
const adminRoutes = require("./routes/admin.routes");
const errorMiddleware = require("./middlewares/error.middleware");

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true
  })
);

app.use(express.json());
app.use(cookieParser());

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

async function startServer() {
  try {
    await connectDB();
    initializeSocket(server);

    server.listen(PORT, () => {
      console.log(`Backend server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start backend server:", error.message);
    process.exit(1);
  }
}

startServer();
