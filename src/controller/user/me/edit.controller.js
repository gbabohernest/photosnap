import User from "../../../models/user.model.js";
import APIError from "../../../utils/ApiError.js";
import { updateSchema } from "../../../utils/schema-validation/userSchema.validation.js";
import transactionsHelper from "../../../utils/mongoose.transaction.helper.js";

async function editMe(req, res) {
  const { userId } = req.userInfo;

  const user = await User.findById(userId, "", null);

  if (!user) {
    throw APIError.notFound("User not found!");
  }

  const { value, error } = updateSchema.validate(req.body);

  if (error) {
    console.log(error);
    throw APIError.badRequest(error.details[0].message);
  }

  Object.assign(user, { ...value });

  const updatedUser = await transactionsHelper(async (session) => {
    return await user.save({
      session,
      validateBeforeSave: true,
      validateModifiedOnly: true,
      timestamps: false,
    });
  });

  res
    .status(200)
    .json({ success: true, message: "Update success", updatedUser });
}

export { editMe };
