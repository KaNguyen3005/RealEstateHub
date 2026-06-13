const { cloudinary, configureCloudinary } = require("../config/cloudinary");
const { createHttpError } = require("../utils/httpError");

function ensureCloudinaryConfigured() {
  if (
    !process.env.CLOUDINARY_CLOUD_NAME ||
    !process.env.CLOUDINARY_API_KEY ||
    !process.env.CLOUDINARY_API_SECRET
  ) {
    throw createHttpError(500, "Cloudinary is not configured");
  }

  configureCloudinary();
}

function uploadBufferToCloudinary(file) {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "realestatehub/properties",
        resource_type: "image",
      },
      (error, result) => {
        if (error || !result?.secure_url) {
          return reject(error || new Error("Cloudinary upload failed"));
        }

        return resolve(result.secure_url);
      }
    );

    uploadStream.end(file.buffer);
  });
}

async function uploadPropertyImages(files = []) {
  ensureCloudinaryConfigured();

  if (!Array.isArray(files) || files.length === 0) {
    throw createHttpError(400, "At least one image is required");
  }

  const urls = await Promise.all(files.map((file) => uploadBufferToCloudinary(file)));

  return {
    urls,
  };
}

module.exports = {
  uploadPropertyImages,
};
