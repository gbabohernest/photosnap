import Image from "../../../models/image.model.js";

async function uploadImage(req, res, next) {
  const image = await Image.create({ ...req.body });

  console.log(image);
  res.status(201).json({ success: true, message: "upload successful" });
}

export { uploadImage };
