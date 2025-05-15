import mongoose from "mongoose";
import APIError from "../utils/ApiError.js";

const imageSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Image title is required"],
      trim: true,
      maxLength: [50, "Image Title cannot exceeds 50 characters"],
      validate: {
        validator: function (value) {
          return /^[A-Za-z][A-Za-z0-9\s_.,-]*$/.test(value);
        },
        message:
          "Title must start with a letter and can only contain letters, numbers, spaces, underscores, hyphens, periods, and commas",
      },
    },
    description: {
      type: String,
      required: [true, "Image description is required"],
      trim: true,
      maxLength: [100, "Image description cannot exceeds 100 characters"],
    },

    imageURL: {
      type: String,
      required: [true, "image url is required"],
      trim: true,
    },

    publicId: {
      type: String,
      required: [true, "image public id is required"],
      trim: true,
    },

    tags: {
      type: [String],
      required: [true, "Tags are required"],
      validate: [
        {
          validator: function (value) {
            return Array.isArray(value);
          },
          message: "Tags must an array of strings",
        },

        {
          validator: function (value) {
            return value.length > 0;
          },

          message: "At least one tag is required",
        },

        {
          validator: function (value) {
            return value.every(
              (val) => typeof val === "string" && val.trim() !== "",
            );
          },
          message: "Each tag must be a non-empty string",
        },
      ],
      index: true,
    },
  },
  { timestamps: true },
);

imageSchema.pre("save", function (next) {
  if (!Array.isArray(this.tags)) {
    const err = APIError.badRequest("Tags must be an array of strings");
    return next(err);
  }
  console.log("pre save hook was reached");
  next();
});

const Image = mongoose.model("Image", imageSchema);

export default Image;
