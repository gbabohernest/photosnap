import Joi from "joi";

const imageSchemaValidation = Joi.object({
  title: Joi.string()
    .required()
    .max(50)
    .trim(true)
    .pattern(/^[A-Za-z][A-Za-z0-9\s_.,-]*$/)
    .messages({
      "string.pattern.base":
        "Title must start with a letter and can only contain letters, numbers, spaces, underscores, hyphens, periods, and commas",
      "string.max": "Title cannot exceeds 50 characters",
      "string.empty": "Title is a required field.",
      "any.required": "Title is required",
    }),

  description: Joi.string().required().max(100).trim(true).messages({
    "string.empty": "Description is a required field",
    "string.max": "Description cannot exceeds 100 characters",
    "any.required": "Description is required",
  }),

  category: Joi.string()
    .trim(true)
    .required()
    .pattern(/^[a-zA-Z0-9_]+$/)
    .messages({
      "string.empty": "Category is required",
      "any.required": "Category is required",
      "string.pattern.base":
        "Category must be a single word with no spaces. Only letters, numbers, and underscores allowed",
    }),

  tags: Joi.array()
    .min(1)
    .items(Joi.string().trim(true).min(1))
    .required()
    .messages({
      "array.base": "Tags must be an array",
      "array.min": "Tags must contain at least 1 items",
      "string.empty": "Each tag must be a non-empty string",
      "any.required": "Tags is required",
    }),
});

const imageUpdateSchema = Joi.object({
  title: Joi.string()
    .optional()
    .trim(true)
    .max(50)
    .pattern(/^[A-Za-z][A-Za-z0-9\s_.,-]*$/)
    .messages({
      "string.pattern.base":
        "Title must start with a letter and can only contain letters, numbers, spaces, underscores, hyphens, periods, and commas",
      "string.max": "Title cannot exceeds 50 characters",
      "string.empty": "Title is not allowed to be empty.",
    }),

  description: Joi.string().optional().max(100).trim(true).messages({
    "string.empty": "Description is not allowed to be empty",
    "string.max": "Description cannot exceeds 100 characters",
  }),

  category: Joi.string()
    .trim(true)
    .optional()
    .pattern(/^[a-zA-Z0-9_]+$/)
    .messages({
      "string.empty": "Category is not allowed to be empty",
      "string.pattern.base":
        "Category must be a single word with no spaces. Only letters, numbers, and underscores allowed",
    }),

  tags: Joi.array()
    .min(1)
    .items(Joi.string().trim(true).min(1))
    .optional()
    .messages({
      "array.base": "Tags must be an array",
      "array.min": "Tags must contain at least 1 items",
      "string.empty": "Tag is not allowed to be empty",
    }),
});

export { imageSchemaValidation, imageUpdateSchema };
