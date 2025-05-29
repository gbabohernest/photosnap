import { StatusCodes } from "http-status-codes";
import Image from "../../../models/image.model.js";
import APIError from "../../../utils/ApiError.js";
import transactionsHelper from "../../../utils/mongoose.transaction.helper.js";
import deleteFromCloudinary from "../../../utils/delete-from-cloudinary.js";
import User from "../../../models/user.model.js";
import { NODE_ENV } from "../../../config/env.config.js";

async function deleteImage(req, res, next) {
  const { id: imgId } = req.params;

  const img = await Image.findOne(
    {
      _id: imgId,
      uploaded_by: req.userInfo.userId,
    },
    "",
    null,
  );

  if (!img) {
    throw APIError.notFound("Image not found!");
  }

  const { publicId, _id } = img;

  try {
    await transactionsHelper(async (session) => {
      await Image.findByIdAndDelete(_id).session(session);
    });

    await deleteFromCloudinary(publicId);

    res.status(StatusCodes.NO_CONTENT).send();
  } catch (error) {
    next(error);
  }
}

async function deleteMyAccount(req, res) {
  const { userId } = req.userInfo;

  const userImages = await Image.find(
    { uploaded_by: userId },
    "publicId",
    null,
  );

  try {
    await transactionsHelper(async (session) => {
      if (userImages) {
        for (const image of userImages) {
          await Image.findByIdAndDelete(image._id).session(session);
          await deleteFromCloudinary(image.publicId);
        }
      }

      await User.findByIdAndDelete(userId).session(session);

      res.cookie("auth", "", {
        maxAge: 1,
        httpOnly: true,
        secure: NODE_ENV === "production",
        sameSite: NODE_ENV === "production" ? "lax" : "strict",
      });
      return res.status(StatusCodes.NO_CONTENT).send();
    });
  } catch (error) {
    throw new APIError(`Failed to delete your account: ${error.message}`);
  }
}

export { deleteImage, deleteMyAccount };
