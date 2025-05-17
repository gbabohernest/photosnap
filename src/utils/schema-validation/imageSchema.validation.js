import Joi from "joi";

const imageSchemaValidation = Joi.object({
  title: Joi.string()
    .required()
    .max(50)
    .trim(true)
    .pattern(/^[A-Za-z][A-Za-z0-9\s_.,-]*$/)
    .messages({
      "string.pattern.base": "Title must start with a letter",
      "string.max": "Title cannot exceeds 50 characters",
      "string.empty": "Title is a required field.",
      "any.required": "Title is required",
    }),

  description: Joi.string().required().max(100).trim(true).messages({
    "string.empty": "Description is a required field",
    "string.max": "Description cannot exceeds 100 characters",
    "any.required": "Description is required",
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

export default imageSchemaValidation;
