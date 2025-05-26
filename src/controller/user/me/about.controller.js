import API_SUCCESS_RESPONSES from "../../../utils/api-success-responses.js";
import User from "../../../models/user.model.js";
import Image from "../../../models/image.model.js";
import APIError from "../../../utils/ApiError.js";
import paginate from "../../../utils/paginate.js";
import { StatusCodes } from "http-status-codes";

async function aboutMe(req, res) {
  const { userId } = req.userInfo;

  const [user, totalUploads] = await Promise.all([
    User.findById(userId, "-password -_id", null),
    Image.countDocuments({ uploaded_by: userId }),
  ]);

  if (!user) {
    throw APIError.notFound("No user found!");
  }

  res.status(StatusCodes.OK).json({
    success: true,
    message: API_SUCCESS_RESPONSES.account.DETAILS,
    data: {
      accountDetails: user,
      totalUploads,
    },
  });
}

async function myUploads(req, res) {
  const { userId } = req.userInfo;

  const images = await paginate(Image, req, {
    filter: { uploaded_by: userId },
    sort: "-updatedAt",
    searchFields: ["title", "description", "category", "tags"],
  });

  if (images.length === 0) {
    return res.status(StatusCodes.OK).json({
      success: true,
      message: "You have not uploaded any data. Start uploading",
    });
  }

  res.status(StatusCodes.OK).json({
    success: true,
    message: API_SUCCESS_RESPONSES.image.LIST_OF_IMAGES,
    data: images,
  });
}

export { aboutMe, myUploads };
