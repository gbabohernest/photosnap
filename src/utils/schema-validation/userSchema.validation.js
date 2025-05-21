import Joi from "joi";

const userSchemaValidation = Joi.object({
  username: Joi.string()
    .min(3)
    .max(20)
    .trim(true)
    .required()
    .pattern(/^[A-Za-z][A-Za-z0-9_]{2,19}$/)
    .messages({
      "string.pattern.base":
        "Username cannot start with a number and must not contain spaces.",
      "string.min": "Username must be at least 3 characters",
      "string.max": "Username cannot exceed 20 characters",
      "string.empty": "Username is a required field",
    }),

  email: Joi.string()
    .email({ tlds: { allow: false } })
    .pattern(/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/)
    .required()
    .trim(true)
    .messages({
      "string.pattern.base":
        "Email must be in all lowercase letters without uppercase letters, TLD 3 or 4 letters",
      "string.empty": "Email is a required field",
    }),

  password: Joi.string().required().min(6).max(128).messages({
    "string.min": "Password must be at least 6 characters long ",
    "string.max": "Password cannot exceed 128 characters",
    "string.empty": "Password is a required field",
  }),
});

const authSchema = Joi.object({
  email: Joi.string()
    .required()
    .trim(true)
    .messages({ "string.empty": "Email is a required field" }),
  password: Joi.string()
    .required()
    .messages({ "string.empty": "Password is a required field" }),
});

const updateUserSchema = Joi.object({
  email: Joi.string()
    .optional()
    .trim(true)
    .email({ tlds: { allow: false } })
    .pattern(/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/)
    .messages({
      "string.empty": "Email is not allowed to be empty.",
      "string.pattern.base":
        "Email must be in all lowercase letters without uppercase letters, TLD 3 or 4 letters",
    }),

  username: Joi.string()
    .optional()
    .min(3)
    .max(20)
    .pattern(/^[A-Za-z][A-Za-z0-9_]{2,19}$/)
    .messages({
      "string.min": "Username must be at least 3 characters",
      "string.max": "Username cannot exceed 20 characters",
      "string.empty": "Username is not allowed to be empty.",
      "string.pattern.base":
        "Username cannot start with a number and must not contain spaces.",
    }),

  password: Joi.string().optional().min(6).messages({
    "string.min": "Password must be 6 characters at least",
    "string.empty": "Password  is not allowed to be empty.",
  }),
});

export { userSchemaValidation, authSchema, updateUserSchema };
