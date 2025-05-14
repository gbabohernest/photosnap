import Joi from "joi";

const imageSchemaValidation = Joi.object({
  title: Joi.string()
    .required()
    .max(50)
    .trim(true)
    .pattern(/^[A-Za-z][A-Za-z0-9\s_.,-]*$/)
    .messages({
      "string.pattern.base": "Image Title must start with a letter",
      "string.max": "Image title cannot exceeds 50 characters",
      "string.empty": "Image Title is a required field.",
    }),

  description: Joi.string().required().max(100).trim(true).messages({
    "string.empty": "Image description is a required field",
    "string.max": "Image description cannot exceeds 100 characters",
  }),

  url: Joi.string().required().trim(true).messages({
    "string.empty": "URL is a required field",
  }),

  publicId: Joi.string().required().trim(true).messages({
    "string.empty": "PublicId is a required field",
  }),

  tags: Joi.array().items(Joi.string().trim(true).min(1)).required().messages({
    "array.min": "At least one image tag is required",
    "array.empty": "Tags is a required field",
  }),
});
