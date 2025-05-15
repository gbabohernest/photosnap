import { Router } from "express";
import { uploadImage } from "../controller/user/me/upload.controller.js";

const meRouter = new Router();

meRouter.get("/about-me");
meRouter.post("/uploads", uploadImage);
meRouter.post("/upload/avatar");

export default meRouter;
