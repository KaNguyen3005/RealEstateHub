const cloudinary = require("../config/cloudinary");
const { createHttpError } = require("../utils/httpError");
const {
  isAllowedImageMimeType,
  isValidPropertyImageSize,
} = require("../utils/upload");

function uploadToCloudinary(fileBuffer) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        resource_type: "image",
      },
      (error, result) => {
        if (error) {
          return reject(error);
        }

        return resolve(result);
      }
    );

    stream.end(fileBuffer);
  });
}

function validateImageFile(file) {
  if (!file || !file.buffer) {
    throw createHttpError(400, "Invalid image file");
  }

  if (!isAllowedImageMimeType(file.mimetype)) {
    throw createHttpError(400, "Invalid image type");
  }

  if (!isValidPropertyImageSize(file.size)) {
    throw createHttpError(400, "Each image must be 5MB or smaller");
  }

  return file;
}

async function uploadPropertyImages(files) {
  if (!Array.isArray(files) || files.length === 0) {
    throw createHttpError(400, "At least one image is required");
  }

  const results = await Promise.all(
    files.map(async (file) => {
      validateImageFile(file);

      const result = await uploadToCloudinary(file.buffer);
      return result.secure_url;
    })
  );

  return {
    urls: results,
  };
}

module.exports = {
  uploadPropertyImages,
  validateImageFile,
};
