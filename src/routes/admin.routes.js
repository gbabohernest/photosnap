import { Router } from "express";
import auth from "../middleware/auth.middleware.js";
import admin from "../middleware/admin.middleware.js";
import {
  allImages,
  allUsers,
  metrics,
} from "../controller/user/admin/admin.controller.js";

const adminRouter = new Router();

adminRouter.get("/users", auth, admin, allUsers);
adminRouter.get("/images", auth, admin, allImages);
adminRouter.get("/dashboard", auth, admin, metrics);

export default adminRouter;
