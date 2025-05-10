import mongoose from "mongoose";
import {
  DEFAULT_AVATAR_PUBLIC_ID,
  DEFAULT_AVATAR_URL,
} from "../config/env.config.js";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      minLength: [3, "username must be at least 3 characters"],
      maxLength: [20, "username cannot exceed 20 characters"],
      validate: {
        validator: (val) => /^[A-Za-z][A-Za-z0-9_]{2,29}$/.test(val),
        message:
          "username cannot start with a number, and no space(s) in the name.",
      },
    },

    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      validate: {
        validator: (value) => /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value),
        message: "Please enter a valid email address",
      },
    },

    password: {
      type: String,
      required: true,
      minLength: [6, "Password must be at least 6 characters long"],
      maxLength: [128, "Password cannot exceed 128 character"],
    },

    role: {
      type: String,
      default: "user",
      enum: {
        values: ["user", "admin"],
        message: "{VALUES} is not a valid role",
      },
    },

    avatar: {
      type: String,
      trim: true,
      default: DEFAULT_AVATAR_URL,
    },

    avatarName: {
      type: String,
      trim: true,
      default: DEFAULT_AVATAR_PUBLIC_ID,
    },
  },
  { timestamps: true },
);

const User = mongoose.model("User", userSchema);

export default User;
