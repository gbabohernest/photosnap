import Image from "../../models/image.model.js";
import dateFormatter from "../../utils/date-formatter.js";
import paginate from "../../utils/paginate.js";
import { StatusCodes } from "http-status-codes";
import APIError from "../../utils/ApiError.js";
import API_SUCCESS_RESPONSES from "../../utils/api-success-responses.js";

async function getImages(req, res) {
  const images = await paginate(Image, req, {
    sort: "-updateAt",
    searchFields: ["title", "description", "category", "tags"],
    virtual: "uploader",
  });

  if (images.data.length === 0) {
    return res.status(StatusCodes.OK).json({
      success: true,
      message: "No image found, sign up and start uploading.",
      data: images,
    });
  }

  res.status(StatusCodes.OK).json({
    success: true,
    message: API_SUCCESS_RESPONSES.image.LIST_OF_IMAGES,
    images,
  });
}

async function getImage(req, res) {
  const { id: imageId } = req.params;

  let image = await Image.findById(imageId, "", null).populate(
    "uploader",
    "username avatar -_id",
  );

  if (!image) {
    throw APIError.notFound("Image not found");
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

  res.status(StatusCodes.OK).json({
    success: true,
    message: API_SUCCESS_RESPONSES.image.IMG_DETAILS,
    imgData,
  });
}

export { getImage, getImages };
