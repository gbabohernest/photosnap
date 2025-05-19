import cloudinary from "../config/cloudinary.config.js";
import APIError from "./ApiError.js";

async function deleteFromCloudinary(publicId) {
  try {
    await cloudinary.uploader.destroy(publicId, { invalidate: true });
  } catch (error) {
    throw new APIError(
      `Failed to delete image from CLOUDINARY : ${error.message}`,
    );
  }
}

export default deleteFromCloudinary;
