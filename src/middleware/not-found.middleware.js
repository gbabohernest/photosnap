import { StatusCodes } from "http-status-codes";

function resourceNotFound(req, res, next) {
  res.status(StatusCodes.NOT_FOUND).json({
    success: false,
    message: "Sorry, Resource Not Found!!. Invalid Request",
  });
  next();
}

export default resourceNotFound;
