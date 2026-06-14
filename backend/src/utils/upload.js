const allowedImageMimeTypes = ["image/jpeg", "image/png", "image/webp"];
const maxPropertyImageSizeBytes = 5 * 1024 * 1024;
const maxPropertyImageCount = 10;

function isAllowedImageMimeType(mimeType) {
  return allowedImageMimeTypes.includes(String(mimeType || ""));
}

function isValidPropertyImageSize(size) {
  return Number.isFinite(size) && size > 0 && size <= maxPropertyImageSizeBytes;
}

module.exports = {
  allowedImageMimeTypes,
  maxPropertyImageSizeBytes,
  maxPropertyImageCount,
  isAllowedImageMimeType,
  isValidPropertyImageSize,
};
