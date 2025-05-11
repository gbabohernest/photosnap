import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import {
  DEFAULT_AVATAR_PUBLIC_ID,
  DEFAULT_AVATAR_URL,
} from "../config/env.config.js";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "username is required"],
      unique: true,
      trim: true,
      lowercase: true,
      minLength: [3, "username must be at least 3 characters"],
      maxLength: [20, "username cannot exceed 20 characters"],
      validate: {
        validator: (val) => /^[A-Za-z][A-Za-z0-9_]{2,29}$/.test(val),
        message:
          "username cannot start with a number and must not contain spaces.",
      },
      index: true,
    },

    email: {
      type: String,
      required: [true, "email is required"],
      unique: true,
      trim: true,
      uppercase: false,
      validate: {
        validator: function (value) {
          return /^[a-z0-9._-]+@[a-z0-9.-]+\.[a-z]{2,4}$/.test(value);
        },
        message: "Email must be in all lowercase letters no uppercase letters",
      },
      index: true,
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minLength: [6, "Password must be at least 6 characters long"],
      maxLength: [128, "Password cannot exceed 128 characters"],
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

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);

  next();
});

const User = mongoose.model("User", userSchema);

export default User;
