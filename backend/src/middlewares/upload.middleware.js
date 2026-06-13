const multer = require("multer");
const { createHttpError } = require("../utils/httpError");

const MAX_PROPERTY_IMAGES = 10;
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

const propertyImageUpload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: MAX_FILE_SIZE_BYTES,
    files: MAX_PROPERTY_IMAGES,
  },
  fileFilter: (_req, file, cb) => {
    if (!ALLOWED_IMAGE_TYPES.includes(file.mimetype)) {
      return cb(createHttpError(400, "Only JPEG, PNG, and WEBP images are allowed"));
    }

    return cb(null, true);
  },
}).array("images", MAX_PROPERTY_IMAGES);

function uploadPropertyImages(req, res, next) {
  propertyImageUpload(req, res, (error) => {
    if (!error) {
      return next();
    }

    if (error instanceof multer.MulterError) {
      if (error.code === "LIMIT_FILE_SIZE") {
        return next(createHttpError(400, "Each image must not exceed 5MB"));
      }

      if (error.code === "LIMIT_FILE_COUNT") {
        return next(createHttpError(400, "You can upload up to 10 images"));
      }

      return next(createHttpError(400, error.message));
    }

    return next(error);
  });
}

module.exports = {
  MAX_PROPERTY_IMAGES,
  uploadPropertyImages,
};
