import { StatusCodes } from "http-status-codes";
import Image from "../../../models/image.model.js";
import APIError from "../../../utils/ApiError.js";
import transactionsHelper from "../../../utils/mongoose.transaction.helper.js";
import deleteFromCloudinary from "../../../utils/delete-from-cloudinary.js";

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
  res.status(StatusCodes.NO_CONTENT).send();
}

export { deleteImage, deleteMyAccount };
