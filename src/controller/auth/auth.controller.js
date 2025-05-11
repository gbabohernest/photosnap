import { StatusCodes } from "http-status-codes";
import transactionsHelper from "../../utils/mongoose.transaction.helper.js";
import User from "../../models/user.model.js";
import APIError from "../../utils/ApiError.js";
import { userSchemaValidation } from "../../utils/schema-validation/userSchema.validation.js";

async function signUp(req, res, next) {
  await transactionsHelper(async (session) => {
    const { value, error } = userSchemaValidation.validate({
      ...req.body,
    });

    if (error) {
      return next(
        APIError.badRequest(
          error?.details[0]?.message || "Please provide valid Data",
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

async function signIn(req, res) {
  res
    .status(StatusCodes.OK)
    .json({ success: true, message: "sign in success" });
}

async function signOut(req, res) {
  res
    .status(StatusCodes.OK)
    .json({ success: true, message: "Sign out success" });
}
export { signUp, signIn, signOut };
