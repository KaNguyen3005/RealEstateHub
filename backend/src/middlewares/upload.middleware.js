const multer = require("multer");
const { createHttpError } = require("../utils/httpError");
const {
  allowedImageMimeTypes,
  maxPropertyImageCount,
  maxPropertyImageSizeBytes,
  isAllowedImageMimeType,
} = require("../utils/upload");

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: maxPropertyImageSizeBytes,
    files: maxPropertyImageCount,
  },
  fileFilter: (req, file, cb) => {
    if (!isAllowedImageMimeType(file.mimetype)) {
      return cb(createHttpError(400, `Invalid image type. Allowed types: ${allowedImageMimeTypes.join(", ")}`));
    }

    return cb(null, true);
  },
});

const parseUploadError = (error) => {
  if (!error) {
    return null;
  }

  if (error instanceof multer.MulterError) {
    if (error.code === "LIMIT_FILE_SIZE") {
      return createHttpError(400, "Each image must be 5MB or smaller");
    }

    if (error.code === "LIMIT_FILE_COUNT") {
      return createHttpError(400, `You can upload up to ${maxPropertyImageCount} images`);
    }

    if (error.code === "LIMIT_UNEXPECTED_FILE") {
      return createHttpError(400, "Unexpected file field");
    }
  }

  if (error.statusCode) {
    return error;
  }

  return createHttpError(400, error.message || "Invalid image upload");
};

function uploadPropertyImages(req, res, next) {
  upload.array("images", maxPropertyImageCount)(req, res, (error) => {
    if (error) {
      return next(parseUploadError(error));
    }

    return next();
  });
}

module.exports = {
  uploadPropertyImages,
};
