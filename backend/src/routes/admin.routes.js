const express = require("express");
const asyncHandler = require("../utils/asyncHandler");
const protect = require("../middlewares/protect.middleware");
const allowRoles = require("../middlewares/role.middleware");
const adminController = require("../controllers/admin.controller");

const router = express.Router();

router.use(protect, allowRoles("admin"));

router.get("/stats", asyncHandler(adminController.getStats));
router.get("/users", asyncHandler(adminController.getUsers));
router.patch("/users/:id/role", asyncHandler(adminController.updateUserRole));
router.patch("/users/:id/status", asyncHandler(adminController.updateUserStatus));

router.get("/properties/pending", asyncHandler(adminController.getPendingProperties));
router.patch("/properties/:id/approve", asyncHandler(adminController.approveProperty));
router.patch("/properties/:id/reject", asyncHandler(adminController.rejectProperty));
router.patch("/properties/:id/hide", asyncHandler(adminController.hideProperty));

router.get("/contact-requests", asyncHandler(adminController.getContactRequests));

module.exports = router;
