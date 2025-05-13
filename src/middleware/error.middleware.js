import { StatusCodes } from "http-status-codes";

const { BAD_REQUEST, CONFLICT } = StatusCodes;

function globalErrorMiddleware(err, req, res, next) {
  let message = err.message || "Internal Server Error";
  let status = err.statusCode || 500;

  // mongoose duplicate key error
  if (err.code === 11000) {
    const errObj = err?.keyValue;

    let msg = "";

    Object.keys(errObj).forEach((val) => {
      const message = `${val} -> ${errObj[val]} already exists. Duplicate Value Error.`;
      msg += message;
    });

    message = msg;
    status = CONFLICT;
  }

  if (err.name === "ValidationError") {
    if (err?.errors) {
      const errsOjb = err.errors;
      const keys = Object.keys(errsOjb);

      let msg = "";

      keys.forEach((key, index) => {
        const message = errsOjb[key].message.replace("Path", "").trim();

        msg += message;

        if (index < keys.length - 1) {
          msg += " | ";
        }
      });

      message = msg;
      status = BAD_REQUEST;
    }
  }

  res.status(status).json({ success: false, message, err });
}

export default globalErrorMiddleware;
