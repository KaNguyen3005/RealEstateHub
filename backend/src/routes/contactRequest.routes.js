const express = require("express");
const asyncHandler = require("../utils/asyncHandler");
const optionalAuth = require("../middlewares/optionalAuth.middleware");
const contactRequestController = require("../controllers/contactRequest.controller");

const router = express.Router();

router.post(
  "/",
  optionalAuth,
  asyncHandler(contactRequestController.createContactRequest)
);

module.exports = router;
