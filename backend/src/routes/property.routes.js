const express = require("express");
const asyncHandler = require("../utils/asyncHandler");
const propertyController = require("../controllers/property.controller");
const optionalAuth = require("../middlewares/optionalAuth.middleware");
const protect = require("../middlewares/protect.middleware");
const allowRoles = require("../middlewares/role.middleware");

const router = express.Router();

// Public routes must stay above /:id so "compare" is not treated as an id.
router.get("/", optionalAuth, asyncHandler(propertyController.getProperties));
router.get("/compare", optionalAuth, asyncHandler(propertyController.getPropertiesForCompare));
router.get("/:id", optionalAuth, asyncHandler(propertyController.getPropertyById));

router.post(
  "/",
  protect,
  allowRoles("seller", "admin"),
  asyncHandler(propertyController.createProperty)
);

router.put(
  "/:id",
  protect,
  allowRoles("seller", "admin"),
  asyncHandler(propertyController.updateProperty)
);

router.delete(
  "/:id",
  protect,
  allowRoles("seller", "admin"),
  asyncHandler(propertyController.deleteProperty)
);

router.patch(
  "/:id/status",
  protect,
  allowRoles("admin"),
  asyncHandler(propertyController.updatePropertyStatus)
);

module.exports = router;
