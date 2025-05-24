import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import {
  DEFAULT_AVATAR_PUBLIC_ID,
  DEFAULT_AVATAR_URL,
  JWT_EXPIRES_IN,
  JWT_SECRET,
} from "../config/env.config.js";
import jwt from "jsonwebtoken";
import APIError from "../utils/ApiError.js";
import { StatusCodes } from "http-status-codes";
import dateFormatter from "../utils/date-formatter.js";

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
      index: true,
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

userSchema.methods.passwordVerified = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.getToken = async function () {
  try {
    return await jwt.sign(
      {
        userId: this._id,
        name: this.username,
        userRole: this.role,
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN },
    );
  } catch (error) {
    throw new APIError(
      `Something went wrong, failed to generate user token: ${error.message}`,
      StatusCodes.INTERNAL_SERVER_ERROR,
    );
  }
};

userSchema.statics.login = async function (email, password) {
  const user = await this.findOne({ email }, "password username role", null);

  if (!user) {
    throw APIError.unauthorized("Invalid Email ID.");
  }

  const isAuth = await user.passwordVerified(password);

  if (!isAuth) {
    throw APIError.unauthorized("Wrong Password");
  }

  const token = await user.getToken();

  return { token, user };
};

userSchema.set("toJSON", {
  transform: (doc, ret) => {
    const { _id, username, email, password, avatar, createdAt, updatedAt } =
      ret;

    return {
      _id,
      username,
      email,
      password,
      avatar,
      joined: dateFormatter(createdAt),
      lastUpdated: dateFormatter(updatedAt),
    };
  },
});
const User = mongoose.model("User", userSchema);

export default User;
