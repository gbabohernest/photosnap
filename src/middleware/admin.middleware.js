import APIError from "../utils/ApiError.js";
import { StatusCodes } from "http-status-codes";

function admin(req, res, next) {
  const { userRole } = req.userInfo;

  if (userRole !== "admin") {
    return next(
      new APIError(
        "Your are Forbidden to make this request ",
        StatusCodes.FORBIDDEN,
      ),
    );
  }

  next();
}

export default admin;
