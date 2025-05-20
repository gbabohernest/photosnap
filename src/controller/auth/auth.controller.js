import { StatusCodes } from "http-status-codes";
import transactionsHelper from "../../utils/mongoose.transaction.helper.js";
import User from "../../models/user.model.js";
import APIError from "../../utils/ApiError.js";
import {
  authSchema,
  userSchemaValidation,
} from "../../utils/schema-validation/userSchema.validation.js";
import { MAX_AGE, NODE_ENV } from "../../config/env.config.js";

async function signUp(req, res, next) {
  const { value, error } = userSchemaValidation.validate(req.body);

  if (error) {
    return next(APIError.badRequest(error.details[0].message));
  }

  const { username, email, password } = value;

  const existingUser = await User.findOne(
    { $or: [{ username }, { email }] },
    "username email",
    null,
  );

  if (existingUser) {
    if (existingUser.username === username) {
      return next(APIError.conflict("Username is already taken"));
    }

    if (existingUser.email === email) {
      return next(APIError.conflict("Email is already registered"));
    }
  }

  const user = await transactionsHelper(async (session) => {
    const user = await User.create([{ username, email, password }], session);
    return user[0];
  });

  res
    .status(StatusCodes.CREATED)
    .json({ success: true, message: "signup successful", user });
}

async function signIn(req, res, next) {
  const { value, error } = authSchema.validate(req.body);

  if (error) {
    return next(APIError.badRequest(error.details[0].message));
  }

  const { email, password } = value;
  const { token, user } = await User.login(email, password);

  res.cookie("auth", token, {
    maxAge: MAX_AGE,
    httpOnly: true,
    secure: NODE_ENV === "production",
    sameSite: NODE_ENV === "production" ? "lax" : "strict",
  });
  res
    .status(StatusCodes.OK)
    .json({ success: true, message: "sign in successful", user });
}

async function signOut(req, res) {
  res
    .status(StatusCodes.OK)
    .json({ success: true, message: "Sign out success" });
}
export { signUp, signIn, signOut };
