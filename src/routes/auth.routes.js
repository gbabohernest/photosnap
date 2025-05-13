import { Router } from "express";
import { signIn, signUp, signOut } from "../controller/auth/auth.controller.js";

const authRouter = new Router();

authRouter.post("/sign-up", signUp);

authRouter.post("/sign-in", signIn);

authRouter.post("/sign-out", signOut);

export default authRouter;
