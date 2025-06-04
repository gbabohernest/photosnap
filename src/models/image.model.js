import mongoose from "mongoose";
import dateFormatter from "../utils/date-formatter.js";
import APIError from "../utils/ApiError.js";

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
      index: true,
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

imageSchema.index(
  { title: 1, description: 1, uploaded_by: 1 },
  { unique: true },
);

//check if title, description, or uploaded_by is unique before saving
imageSchema.pre("save", async function (next) {
  if (this.isNew) {
    const img = await mongoose.models.Image.findOne({
      uploaded_by: this.uploaded_by,
      $or: [{ title: this.title }, { description: this.description }],
    });

    if (img) {
      let msg = "";
      if (img.title === this.title) {
        msg = `An image with this title [ ${img.title} ] already exits in your account, please try with different title.`;
        return next(APIError.conflict(msg));
      }

      if (img.description === this.description) {
        msg = `An image with this description [ ${img.description} ] already exits in your account, please try with different description.`;
        return next(APIError.conflict(msg));
      }
    }
  }

  next();
});

imageSchema.virtual("uploader", {
  ref: "User",
  localField: "uploaded_by",
  foreignField: "_id",
  justOne: true,
  options: { select: "-joined -lastUpdated", lean: true },
});

imageSchema.set("toObject", {
  virtuals: true,
  transform: (_, ret) => {
    // delete ret._id;
    delete ret.id;

    return ret;
  },
});

imageSchema.set("toJSON", {
  virtuals: true,
  transform: (doc, ret) => {
    const { _id, description, createdAt, updatedAt, url, tags } = ret;

    return {
      _id,
      url,
      description,
      lastUpdated: dateFormatter(updatedAt),
      published: dateFormatter(createdAt),
      "published by": ret.uploader,
      tags,
    };
  },
});
const Image = mongoose.model("Image", imageSchema);

export default Image;
