import mongoose from "mongoose";
import { DB_URL, NODE_ENV } from "./env.config.js";

/**
 * connects to a mongodb database
 * @returns {Promise<void>}
 */
async function databaseConnection() {
  try {
    await mongoose.connect(DB_URL);
    console.log(`success: connected to database in ${NODE_ENV} mode... `);
  } catch (error) {
    console.error(`Database connection failed : ${error.message}`);
    process.exit(1);
  }
}

export default databaseConnection;
