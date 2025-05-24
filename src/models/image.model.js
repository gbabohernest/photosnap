import mongoose from "mongoose";
import dateFormatter from "../utils/date-formatter.js";

const imageSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxLength: [50, "Title cannot exceeds 50 characters"],
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
      required: [true, "Description is required"],
      trim: true,
      maxLength: [100, "Description cannot exceeds 100 characters"],
    },

    url: {
      type: String,
      required: [true, "Image url is required"],
      trim: true,
    },

    publicId: {
      type: String,
      required: [true, "Image public id is required"],
      trim: true,
    },

    category: {
      type: String,
      required: [true, "Category is required"],
      trim: true,
      validate: {
        validator: function (val) {
          return /^[a-zA-Z0-9_]+$/.test(val);
        },
        message:
          "Category must be a single word with no spaces. Only letters, numbers, and underscores allowed.",
      },
    },

    uploaded_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Please provide the user whom uploaded this asset"],
      index: true,
    },

    tags: {
      // type: [String],
      type: mongoose.Schema.Types.Mixed,
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

imageSchema.virtual("uploader", {
  ref: "User",
  localField: "uploaded_by",
  foreignField: "_id",
  justOne: true,
  options: { select: "-joined -lastUpdated", lean: true },
});

imageSchema.set("toJSON", {
  virtuals: true,
  transform: (doc, ret) => {
    const { _id, description, createdAt, updatedAt } = ret;

    return {
      _id,
      description,
      uploaded: dateFormatter(createdAt),
      updated: dateFormatter(updatedAt),
      uploader: ret.uploader,
    };
  },
});
const Image = mongoose.model("Image", imageSchema);

export default Image;
