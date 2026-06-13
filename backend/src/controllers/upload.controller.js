const uploadService = require("../services/upload.service");
const { successResponse } = require("../utils/apiResponse");

async function uploadPropertyImages(req, res) {
  const data = await uploadService.uploadPropertyImages(req.files);

  return res.status(201).json(
    successResponse("Images uploaded successfully", data)
  );
}

module.exports = {
  uploadPropertyImages,
};
