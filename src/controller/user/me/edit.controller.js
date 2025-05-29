import User from "../../../models/user.model.js";
import APIError from "../../../utils/ApiError.js";
import { updateUserSchema } from "../../../utils/schema-validation/userSchema.validation.js";
import transactionsHelper from "../../../utils/mongoose.transaction.helper.js";
import { DEFAULT_AVATAR_PUBLIC_ID } from "../../../config/env.config.js";
import deleteFromCloudinary from "../../../utils/delete-from-cloudinary.js";
import uploadToCloudinary from "../../../utils/uploader.js";
import { StatusCodes } from "http-status-codes";
import { imageUpdateSchema } from "../../../utils/schema-validation/imageSchema.validation.js";
import Image from "../../../models/image.model.js";
import fs from "node:fs/promises";
import API_SUCCESS_RESPONSES from "../../../utils/api-success-responses.js";

async function editMe(req, res) {
  const { userId } = req.userInfo;

  const user = await User.findById(userId, "", null);

  if (!user) {
    throw APIError.notFound("User not found");
  }

  const { value, error } = updateUserSchema.validate(req.body);

  if (error) {
    throw APIError.badRequest(error.details[0].message);
  }

  Object.assign(user, { ...value });

  const updatedUser = await transactionsHelper(async (session) => {
    return await user.save({
      session,
      validateBeforeSave: true,
      validateModifiedOnly: true,
      // timestamps: false,
    });
  });

  res.status(StatusCodes.OK).json({
    success: true,
    message: API_SUCCESS_RESPONSES.account.UPDATED,
    updatedUser,
  });
}

async function updateAvatar(req, res) {
  if (!req.file || !req.file.path) {
    throw APIError.badRequest("Please add your avatar");
  }

  const user = await User.findById(
    req.userInfo.userId,
    "avatar avatarName",
    null,
  );

  if (!user) {
    throw APIError.notFound("User not found!");
  }

  if (user.avatarName !== DEFAULT_AVATAR_PUBLIC_ID) {
    await deleteFromCloudinary(user.avatarName);
  }

  const { url, publicId } = await uploadToCloudinary(req.file.path);

  Object.assign(user, { avatar: url, avatarName: publicId });

  const newAvatar = await transactionsHelper(async (session) => {
    return await user.save({
      session,
      validateBeforeSave: true,
      validateModifiedOnly: true,
    });
  });

  res.status(StatusCodes.OK).json({
    success: true,
    message: API_SUCCESS_RESPONSES.avatar.UPDATED,
    avatar: newAvatar.avatar,
  });
}

async function updateImage(req, res) {
  const { id: imgId } = req.params;
  const { userId } = req.userInfo;

  const { value: updateData, error } = imageUpdateSchema.validate(req.body);

  if (error) {
    if (req.file) {
      await fs.unlink(req.file?.path);
    }
    throw APIError.badRequest(error.details[0].message);
  }

  const img = await Image.findOne(
    { _id: imgId, uploaded_by: userId },
    "",
    null,
  );

  if (!img) {
    if (req.file) {
      await fs.unlink(req.file?.path);
    }
    throw APIError.notFound("Image not found");
  }

  let updatedData;

  if (req.file) {
    await deleteFromCloudinary(img.publicId);

    const { url, publicId } = await uploadToCloudinary(req.file.path);

    const updatePayload = {
      url,
      publicId,
      ...updateData,
    };
    Object.assign(img, updatePayload);

    updatedData = await transactionsHelper(async (session) => {
      return await img.save({
        session,
        validateBeforeSave: true,
        validateModifiedOnly: true,
      });
    });
  } else {
    Object.assign(img, updateData);
    updatedData = await transactionsHelper(async (session) => {
      return await img.save({
        session,
        validateBeforeSave: true,
        validateModifiedOnly: true,
      });
    });
  }

  res.status(StatusCodes.OK).json({
    success: true,
    message: API_SUCCESS_RESPONSES.image.UPDATED,
    data: updatedData,
  });
}

export { editMe, updateAvatar, updateImage };
