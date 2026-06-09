const path = require("path");
const dotenv = require("dotenv");
const express = require("express");

dotenv.config({ path: path.resolve(__dirname, "../.env") });

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "RealEstateHub backend is running"
  });
});

app.listen(PORT, () => {
  console.log(`Backend server is running on port ${PORT}`);
});
