const propertyService = require("../services/property.service");
const { successResponse } = require("../utils/apiResponse");
const { createHttpError } = require("../utils/httpError");

async function getProperties(req, res) {
  const data = await propertyService.getProperties(req.query);

  return res.status(200).json(
    successResponse("Properties retrieved successfully", data)
  );
}

async function getPropertiesForCompare(req, res) {
  const data = await propertyService.getPropertiesForCompare(
    req.query.ids,
    req.user
  );

  return res.status(200).json(
    successResponse("Compare properties retrieved successfully", data)
  );
}

async function getPropertyById(req, res) {
  const property = await propertyService.getPropertyById(req.params.id, req.user);

  return res.status(200).json(
    successResponse("Property retrieved successfully", {
      item: property,
    })
  );
}

async function createProperty(req, res) {
  const property = await propertyService.createProperty(req.user._id, req.body);

  return res.status(201).json(
    successResponse("Property created successfully", {
      item: property,
    })
  );
}

async function updateProperty(req, res) {
  const hasUpdateField = Object.keys(req.body || {}).some((key) => {
    return key !== "status" && key !== "ownerId" && key !== "slug";
  });

  if (!hasUpdateField) {
    throw createHttpError(400, "At least one property field is required");
  }

  const property = await propertyService.updateProperty(req.user, req.params.id, req.body);

  return res.status(200).json(
    successResponse("Property updated successfully", {
      item: property,
    })
  );
}

async function deleteProperty(req, res) {
  const property = await propertyService.deleteProperty(req.user, req.params.id);

  return res.status(200).json(
    successResponse("Property deleted successfully", {
      item: property,
    })
  );
}

async function updatePropertyStatus(req, res) {
  const property = await propertyService.updatePropertyStatus(req.params.id, req.body.status);

  return res.status(200).json(
    successResponse("Property status updated successfully", {
      item: property,
    })
  );
}

module.exports = {
  getProperties,
  getPropertiesForCompare,
  getPropertyById,
  createProperty,
  updateProperty,
  deleteProperty,
  updatePropertyStatus,
};
