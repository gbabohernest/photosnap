import { config } from "dotenv";

config();

export const {
  PORT,
  DB_URL,
  NODE_ENV,
  DEFAULT_AVATAR_URL,
  DEFAULT_AVATAR_PUBLIC_ID,
  JWT_SECRET,
  JWT_EXPIRES_IN,
  MAX_AGE,
  CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
} = process.env;
