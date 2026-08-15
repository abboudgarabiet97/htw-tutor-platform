const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");

// Cloudinary free tier (no credit card required) is used instead of a paid
// cloud storage account. If no credentials are configured (e.g. local dev
// without a Cloudinary account yet) uploads are skipped and the frontend
// falls back to a placeholder image.
function isConfigured() {
  return Boolean(
    process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET
  );
}

if (isConfigured()) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

function uploadTutorImage(fileBuffer) {
  if (!isConfigured()) return Promise.resolve(null);

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: "tutor-images" },
      (error, result) => {
        if (error) return reject(error);
        resolve(result.secure_url);
      }
    );
    streamifier.createReadStream(fileBuffer).pipe(uploadStream);
  });
}

module.exports = { uploadTutorImage };
