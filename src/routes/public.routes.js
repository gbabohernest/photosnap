import { Router } from "express";
import { getImage, getImages } from "../controller/user/public.controller.js";

const publicRouter = new Router();

publicRouter.get("/images", getImages);
publicRouter.get("/images/:id", getImage);

export default publicRouter;
