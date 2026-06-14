const path = require("path");
const http = require("http");
const dotenv = require("dotenv");

dotenv.config({ path: path.resolve(__dirname, "../.env") });

const connectDB = require("./config/db");
const { initializeSocket } = require("./config/socket");
const { createApp } = require("./app");

const app = createApp();
const server = http.createServer(app);
const PORT = process.env.PORT || 5000;

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

if (require.main === module) {
  startServer();
}

module.exports = {
  app,
  server,
  startServer
};
