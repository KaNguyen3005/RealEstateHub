const express = require("express");
const asyncHandler = require("../utils/asyncHandler");
const favoriteController = require("../controllers/favorite.controller");
const protect = require("../middlewares/protect.middleware");

const router = express.Router();

router.use(protect);

router.get("/", asyncHandler(favoriteController.getFavorites));
router.post("/:propertyId", asyncHandler(favoriteController.addFavorite));
router.delete("/:propertyId", asyncHandler(favoriteController.removeFavorite));

module.exports = router;
