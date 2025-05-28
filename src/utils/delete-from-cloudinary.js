import cloudinary from "../config/cloudinary.config.js";
import logToFile from "./logger.js";

async function deleteFromCloudinary(publicId) {
  try {
    const result = await cloudinary.uploader.destroy(publicId, {
      invalidate: true,
    });

    if (result.result !== "ok") {
      const message = `WARNING: cloudinary deletion failed for ${publicId}`;
      console.warn(message);
      await logToFile(message);
    } else {
      const message = `SUCCESS: image ${publicId} was deleted from cloudinary`;
      console.log(message);
      await logToFile(message);
    }
  } catch (cloudinaryError) {
    const errMsg = `FATAL ERROR: cloudinary deletion error for ${publicId}:  ${cloudinaryError.message}`;
    console.log(errMsg);
    await logToFile(errMsg);
  }
}

export default deleteFromCloudinary;
