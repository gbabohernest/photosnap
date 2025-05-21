import User from "../../../models/user.model.js";
import APIError from "../../../utils/ApiError.js";
import { updateSchema } from "../../../utils/schema-validation/userSchema.validation.js";
import transactionsHelper from "../../../utils/mongoose.transaction.helper.js";
import { DEFAULT_AVATAR_PUBLIC_ID } from "../../../config/env.config.js";
import deleteFromCloudinary from "../../../utils/delete-from-cloudinary.js";
import uploadToCloudinary from "../../../utils/uploader.js";

async function editMe(req, res) {
  const { userId } = req.userInfo;

  const user = await User.findById(userId, "", null);

  if (!user) {
    throw APIError.notFound("User not found!");
  }

  const { value, error } = updateSchema.validate(req.body);

  if (error) {
    console.log(error);
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

  res.status(200).json({
    success: true,
    message: "Account information updated successfully",
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

  if (user && user.avatarName !== DEFAULT_AVATAR_PUBLIC_ID) {
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

  res.status(200).json({
    success: true,
    message: "Avatar updated successfully",
    avatar: newAvatar.avatar,
  });
}

export { editMe, updateAvatar };
