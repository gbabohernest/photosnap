import Image from "../../../models/image.model.js";
import imageSchemaValidation from "../../../utils/schema-validation/imageSchema.validation.js";
import APIError from "../../../utils/ApiError.js";
import transactionsHelper from "../../../utils/mongoose.transaction.helper.js";
import { StatusCodes } from "http-status-codes";
import uploadToCloudinary from "../../../utils/uploader.js";
import fs from "node:fs/promises";
import deleteFromCloudinary from "../../../utils/delete-from-cloudinary.js";

async function uploadImage(req, res, next) {
  let imgPubId;

  try {
    if (!req.file || !req.file.path) {
      return next(
        APIError.badRequest("Please provide a valid image file to upload."),
      );
    }

    const { value, error } = imageSchemaValidation.validate({ ...req.body });

    if (error) {
      await fs.unlink(req.file.path);
      return next(APIError.badRequest(error?.details[0]?.message));
    }

    const { url, publicId } = await uploadToCloudinary(req.file.path);
    imgPubId = publicId;

    const image = await transactionsHelper(async (session) => {
      const image = await Image.create(
        [{ ...value, url, publicId, uploaded_by: req.userInfo.userId }],
        session,
      );

      return image[0];
    });
    res
      .status(StatusCodes.OK)
      .json({ success: true, message: "upload successful", image });
  } catch (error) {
    if (imgPubId) {
      await deleteFromCloudinary(imgPubId);
    }
    next(error);
  }
}

export { uploadImage };
