import { StatusCodes } from "http-status-codes";

const { BAD_REQUEST, NOT_FOUND, CONFLICT, UNAUTHORIZED } = StatusCodes;

class APIError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.message = message;
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }

  static badRequest(message = "Bad Request") {
    return new APIError(message, BAD_REQUEST);
  }

  static notFound(message = "Resource Not Found") {
    return new APIError(message, NOT_FOUND);
  }

  static unauthorized(message = "Unauthorized Access") {
    return new APIError(message, UNAUTHORIZED);
  }

  static conflict(message = "Duplicate Data Entry") {
    return new APIError(message, CONFLICT);
  }
}

export default APIError;
