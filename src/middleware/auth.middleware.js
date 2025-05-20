import APIError from "../utils/ApiError.js";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/env.config.js";

async function auth(req, res, next) {
  const { auth } = req.cookies;

  if (!auth || auth === "undefined") {
    return next(APIError.unauthorized("No access Token provided."));
  }

  try {
    const payload = await jwt.verify(auth, JWT_SECRET);

    const { userId, name, userRole } = payload;
    req.userInfo = { userId, name, userRole };

    next();
  } catch (error) {
    next(error);
  }
}

export default auth;
