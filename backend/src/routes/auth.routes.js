const express = require("express");
const authController = require("../controllers/auth.controller");
const protect = require("../middlewares/protect.middleware");
const asyncHandler = require("../utils/asyncHandler");

const router = express.Router();

router.post("/register", asyncHandler(authController.register));
router.post("/login", asyncHandler(authController.login));
router.post("/refresh", asyncHandler(authController.refresh));
router.post("/logout", asyncHandler(authController.logout));
router.get("/me", protect, asyncHandler(authController.me));

module.exports = router;
