import Image from "../../models/image.model.js";
import dateFormatter from "../../utils/date-formatter.js";
import paginate from "../../utils/paginate.js";
import { StatusCodes } from "http-status-codes";

async function getImages(req, res) {
  const images = await paginate(Image, req, {
    sort: "-updateAt",
    searchFields: ["title", "description", "category", "tags"],
    virtual: "uploader",
  });

  if (images.length === 0) {
    return res.status(StatusCodes.OK).json({
      success: true,
      message: "No image found, sign up and start uploading.",
    });
  }

  res
    .status(StatusCodes.OK)
    .json({ success: true, message: "list of images", images });
}

async function getImage(req, res) {
  const { id: imageId } = req.params;

  let image = await Image.findById(imageId, "", null).populate(
    "uploader",
    "username avatar -_id",
  );

  if (!image) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ success: false, message: "Image not found!" });
  }

  image = image.toObject();

  const { url, title, description, createdAt, updatedAt, uploader, category } =
    image;

  const imgData = {
    img: url,
    title,
    description,
    published: dateFormatter(createdAt),
    lastUpdated: dateFormatter(updatedAt),
    "published by": uploader.username,
    "publisher avatar": uploader.avatar,
    category,
  };

  res
    .status(StatusCodes.OK)
    .json({ success: true, message: "Image details", imgData });
}

export { getImage, getImages };
