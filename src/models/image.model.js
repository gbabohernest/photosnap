import mongoose from "mongoose";

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
      required: [true, "Image tag is required"],
      validate: [
        {
          validator: function (value) {
            return Array.isArray(value);
          },
          message: "Tags must an array of non empty strings",
        },

        {
          validator: function (value) {
            return value.length > 0;
          },

          message: "Tags must contain at least one tag",
        },

        {
          validator: function (value) {
            return value.every(
              (val) => typeof val === "string" && val.trim() !== "",
            );
          },
          message: "Tag must be a non-empty string",
        },
      ],
      index: true,
    },
  },
  { timestamps: true },
);

const Image = mongoose.model("Image", imageSchema);

export default Image;
