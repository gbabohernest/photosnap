import { Router } from "express";
import { uploadImage } from "../controller/user/me/upload.controller.js";
import upload from "../middleware/multer.middleware.js";
import auth from "../middleware/auth.middleware.js";
import {
  editMe,
  updateAvatar,
  updateImage,
} from "../controller/user/me/edit.controller.js";

import normalizeArrayFields from "../middleware/normalize-array-fields.middleware.js";
import { aboutMe, myUploads } from "../controller/user/me/about.controller.js";
import {
  deleteMyAccount,
  deleteImage,
} from "../controller/user/me/delete.controller.js";

const meRouter = new Router();

meRouter.get("/about-me", auth, aboutMe);
meRouter.get("/uploads", auth, myUploads);

meRouter.post(
  "/uploads",
  auth,
  upload.single("image"),
  normalizeArrayFields(["tags"]),
  uploadImage,
);

meRouter.patch("/update-user", auth, editMe);

meRouter.patch("/update-avatar", auth, upload.single("avatar"), updateAvatar);

meRouter.patch(
  "/uploads/:id",
  auth,
  upload.single("image"),
  normalizeArrayFields(["tags"]),
  updateImage,
);

meRouter.delete("/uploads/:id", auth, deleteImage);
meRouter.delete("/delete", auth, deleteMyAccount);

export default meRouter;
