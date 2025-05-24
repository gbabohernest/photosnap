import Image from "../../models/image.model.js";
import APIError from "../../utils/ApiError.js";
import dateFormatter from "../../utils/date-formatter.js";

async function getImages(req, res) {
  const images = await Image.find({}, "", null)
    .sort({ updatedAt: -1 })
    .populate("uploader", "username avatar  -_id");

  if (images.length === 0) {
    return res.status(200).json({
      success: true,
      message: "No image found, sign up and start uploading.",
    });
  }

  res.status(200).json({ success: true, message: "list of images", images });
}

async function getImage(req, res) {
  const { id: imageId } = req.params;

  let image = await Image.findById(imageId);

  if (!image) {
    throw APIError.badRequest("Resource ID is invalid");
  }

  image = image.toObject();

  const imgData = {
    img: image.url,
    title: image.title,
    published: dateFormatter(image.updatedAt),
  };

  res.status(200).json({ success: true, message: "Image details", imgData });
}

export { getImage, getImages };
