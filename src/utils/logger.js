import path from "node:path";
import { mkdirSync, existsSync } from "fs";
import fs from "node:fs/promises";
import dayjs from "dayjs";

const logDir = path.join(process.cwd(), "logs");

if (!existsSync(logDir)) {
  mkdirSync(logDir, { recursive: true });
}

async function logToFile(message) {
  const logFile = path.join(logDir, "cloudinary.errors.log");
  const timestamp = dayjs().format("YYYY-MM-DD HH:mm:ss");
  const logMessage = `[${timestamp}] - ${message}\n`;

  try {
    await fs.appendFile(logFile, logMessage, "utf8");
  } catch (error) {
    console.error("FAILED TO WRITE TO LOG FILE!", error);
  }
}

export default logToFile;
