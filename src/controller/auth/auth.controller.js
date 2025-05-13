import { StatusCodes } from "http-status-codes";
import transactionsHelper from "../../utils/mongoose.transaction.helper.js";
import User from "../../models/user.model.js";
import APIError from "../../utils/ApiError.js";
import {
  authSchema,
  userSchemaValidation,
} from "../../utils/schema-validation/userSchema.validation.js";

async function signUp(req, res, next) {
  await transactionsHelper(async (session) => {
    const { value, error } = userSchemaValidation.validate({
      ...req.body,
    });

    if (error) {
      return next(
        APIError.badRequest(
          error?.details[0]?.message ||
            "Bad Request, Please provide valid Data",
        ),
      );
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

    const user = await User.create([{ username, email, password }], session);

    return res
      .status(StatusCodes.CREATED)
      .json({ success: true, message: "signup successful", data: user[0] });
  }, next);
}

async function signIn(req, res, next) {
  try {
    const value = await authSchema.validateAsync({ ...req.body });

    const user = await User.findOne(
      { email: value.email },
      "email password username role",
      null,
    );
    if (!user) {
      return next(APIError.unauthorized("Invalid Credential"));
    }

    if (!(await user.passwordVerified(value.password))) {
      return next(APIError.unauthorized());
    }

    const token = await user.getToken();

    res
      .status(StatusCodes.OK)
      .json({ success: true, message: "sign in successful", token, user });
  } catch (err) {
    next(APIError.badRequest(err.message));
  }
}

async function signOut(req, res) {
  res
    .status(StatusCodes.OK)
    .json({ success: true, message: "Sign out success" });
}
export { signUp, signIn, signOut };
