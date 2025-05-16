import Image from "../../../models/image.model.js";
import imageSchemaValidation from "../../../utils/schema-validation/imageSchema.validation.js";
import APIError from "../../../utils/ApiError.js";
import transactionsHelper from "../../../utils/mongoose.transaction.helper.js";
import { StatusCodes } from "http-status-codes";
import uploadToCloudinary from "../../../utils/uploader.js";
import fs from "node:fs/promises";

async function uploadImage(req, res, next) {
  try {
    if (!req.file || !req.file.path) {
      return next(
        APIError.badRequest("Please provide a valid image file to upload."),
      );
    }

    const { value, error } = imageSchemaValidation.validate({ ...req.body });

    if (error) {
      return next(APIError.badRequest(error?.details[0]?.message));
    }

    const { url, publicId } = await uploadToCloudinary(req.file.path);

    await transactionsHelper(async (session) => {
      const image = await Image.create([{ ...value, url, publicId }], session);

      await fs.unlink(req.file.path);
      return res
        .status(StatusCodes.OK)
        .json({ success: true, message: "upload successful", data: image[0] });
    }, next);
  } catch (error) {
    await fs.unlink(req.file.path);
    next(error);
  }
}

export { uploadImage };
