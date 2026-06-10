const express = require("express");
const asyncHandler = require("../utils/asyncHandler");
const protect = require("../middlewares/protect.middleware");
const allowRoles = require("../middlewares/role.middleware");
const { uploadPropertyImages } = require("../middlewares/upload.middleware");
const uploadController = require("../controllers/upload.controller");

const router = express.Router();

router.post(
  "/properties",
  protect,
  allowRoles("seller", "admin"),
  uploadPropertyImages,
  asyncHandler(uploadController.uploadPropertyImages)
);

module.exports = router;
