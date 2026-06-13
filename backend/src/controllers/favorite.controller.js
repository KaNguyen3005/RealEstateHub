const favoriteService = require("../services/favorite.service");
const { successResponse } = require("../utils/apiResponse");

async function getFavorites(req, res) {
  const data = await favoriteService.getUserFavorites(req.user._id);

  return res.status(200).json(
    successResponse("Favorites retrieved successfully", data)
  );
}

async function addFavorite(req, res) {
  const property = await favoriteService.addFavorite(req.user._id, req.params.propertyId);

  return res.status(201).json(
    successResponse("Property added to favorites", {
      item: property,
    })
  );
}

async function removeFavorite(req, res) {
  const data = await favoriteService.removeFavorite(req.user._id, req.params.propertyId);

  return res.status(200).json(
    successResponse("Property removed from favorites", data)
  );
}

module.exports = {
  getFavorites,
  addFavorite,
  removeFavorite,
};
