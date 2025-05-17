import APIError from "./ApiError.js";
import { StatusCodes } from "http-status-codes";
import cloudinary from "../config/cloudinary.config.js";

async function uploadToCloudinary(asset) {
  try {
    const uploadResult = await cloudinary.uploader.upload(asset, {
      transformation: [
        { quality: "auto", fetch_format: "auto" },
        { width: 500, height: 500, crop: "fill", gravity: "auto" },
      ],
    });

    return { url: uploadResult.secure_url, publicId: uploadResult.public_id };
  } catch (error) {
    throw new APIError(
      `FAIL to upload file: ${error.message}`,
      StatusCodes.INTERNAL_SERVER_ERROR,
    );
  }
}

export default uploadToCloudinary;
