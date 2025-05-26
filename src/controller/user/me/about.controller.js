import API_SUCCESS_RESPONSES from "../../../utils/api-success-responses.js";
import User from "../../../models/user.model.js";
import Image from "../../../models/image.model.js";
import APIError from "../../../utils/ApiError.js";
import paginate from "../../../utils/paginate.js";

async function aboutMe(req, res) {
  const { userId } = req.userInfo;

  const [user, totalUploads] = await Promise.all([
    User.findById(userId, "-password -_id", null),
    Image.countDocuments({ uploaded_by: userId }),
  ]);

  if (!user) {
    throw APIError.notFound("No user found!");
  }

  res.status(200).json({
    success: true,
    message: API_SUCCESS_RESPONSES.account.DETAILS,
    data: {
      accountDetails: user,
      totalUploads,
    },
  });
}

export default aboutMe;
