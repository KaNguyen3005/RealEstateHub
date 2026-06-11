const express = require("express");
const asyncHandler = require("../utils/asyncHandler");
const optionalAuth = require("../middlewares/optionalAuth.middleware");
const protect = require("../middlewares/protect.middleware");
const contactRequestController = require("../controllers/contactRequest.controller");

const router = express.Router();

router.post(
  "/",
  optionalAuth,
  asyncHandler(contactRequestController.createContactRequest)
);

router.get(
  "/me",
  protect,
  asyncHandler(contactRequestController.getMyContactRequests)
);

module.exports = router;
