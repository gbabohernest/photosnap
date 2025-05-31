import paginate from "../../../utils/paginate.js";
import User from "../../../models/user.model.js";
import { StatusCodes } from "http-status-codes";
import API_SUCCESS_RESPONSES from "../../../utils/api-success-responses.js";
import Image from "../../../models/image.model.js";

async function allUsers(req, res) {
  const users = await paginate(User, req, {
    sort: { updatedAt: -1 },
    searchFields: ["username"],
  });

  if (users.data.length === 0) {
    return res
      .status(StatusCodes.OK)
      .json({ success: true, message: "There are no registered users" });
  }

  res
    .status(StatusCodes.OK)
    .json({ success: true, message: "A paginated list of users", users });
}

async function allImages(req, res) {
  const images = await paginate(Image, req, {
    sort: { updatedAt: -1 },
    searchFields: ["title", "description", "tags", "category"],
    virtual: "uploader",
  });

  if (images.data.length === 0) {
    return res
      .status(StatusCodes.OK)
      .json({ success: true, message: "No images to display" });
  }

  res.status(StatusCodes.OK).json({
    success: true,
    message: API_SUCCESS_RESPONSES.image.LIST_OF_IMAGES,
    images,
  });
}

async function metrics(req, res) {
  const [users, images] = await Promise.all([
    paginate(User, req),
    paginate(Image, req),
  ]);

  const totalUsers = users.nbHits;
  const totalImages = images.nbHits;

  const result = {
    users: `Total registered users: ${totalUsers}`,
    images: `Total numbers of uploaded images: ${totalImages}`,
  };
  res
    .status(StatusCodes.OK)
    .json({ success: true, message: "PhotoSnap Metrics", result });
}
export { allUsers, allImages, metrics };
