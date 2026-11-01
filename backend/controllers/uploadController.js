import asyncHandler from '../middleware/asyncHandler.js';
import ApiError from '../utils/ApiError.js';
import cloudinary from '../config/cloudinary.js';

const cloudinaryConfigKeys = ['CLOUDINARY_CLOUD_NAME', 'CLOUDINARY_API_KEY', 'CLOUDINARY_API_SECRET'];

const assertCloudinaryConfigured = () => {
  const missing = cloudinaryConfigKeys.filter((key) => !process.env[key]);
  if (missing.length) {
    throw new ApiError(`Image uploads are not configured. Add ${missing.join(', ')} to backend/.env.`, 503);
  }
};

const streamUpload = (buffer, folder) =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream({ folder: `ronvero/${folder}` }, (error, result) => {
      if (result) resolve(result);
      else reject(error);
    });
    stream.end(buffer);
  });

// @route  POST /api/upload  (field name: "images", up to 6 files)
export const uploadImages = asyncHandler(async (req, res) => {
  assertCloudinaryConfigured();
  if (!req.files || req.files.length === 0) throw new ApiError('No files uploaded', 400);

  const folder = req.body.folder || 'misc';
  const results = await Promise.all(req.files.map((file) => streamUpload(file.buffer, folder)));

  const images = results.map((r) => ({ url: r.secure_url, publicId: r.public_id }));
  res.status(201).json({ success: true, images });
});

// @route  DELETE /api/upload/:publicId
export const deleteImage = asyncHandler(async (req, res) => {
  assertCloudinaryConfigured();
  const publicId = decodeURIComponent(req.params.publicId);
  await cloudinary.uploader.destroy(publicId);
  res.json({ success: true, message: 'Image deleted' });
});
