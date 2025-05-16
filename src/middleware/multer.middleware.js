import multer from "multer";
import path from "node:path";
import APIError from "../utils/ApiError.js";
import fs from "node:fs";

const uploadsDirectory = path.join(process.cwd(), "uploads/");

if (!fs.existsSync(uploadsDirectory)) {
  fs.mkdirSync(uploadsDirectory, { recursive: true });
}
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDirectory);
  },

  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.floor(Math.random() * 100) + 1;
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  },
});

const filter = (req, file, cb) => {
  const acceptedTypes = ["image/png", "image/jpeg", "image/gif"];

  if (!acceptedTypes.includes(file.mimetype)) {
    cb(new APIError("Only JPEG, PNG, and GIF files are allowed"), false);
  }

  cb(null, true);
};

const upload = multer({
  fileFilter: filter,
  limits: { fileSize: 5 * 1024 * 1024 },
  storage,
});

export default upload;
