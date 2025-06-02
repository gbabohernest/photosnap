import app from "./app.js";
import { PORT } from "./config/env.config.js";
import databaseConnection from "./config/database.config.js";
import globalErrorMiddleware from "./middleware/error.middleware.js";
import resourceNotFound from "./middleware/not-found.middleware.js";
import { StatusCodes } from "http-status-codes";

app.get("/", (req, res) => {
  res
    .status(StatusCodes.OK)
    .send(
      `<h1 style="text-align: center; font-family: Arial, sans-serif; color: #333; font-size: 2.5rem;">PhotoSnap API v1</h1>` +
        `<a href="/api-docs" style="display: block; text-align: center; margin-top: 20px; font-size: 1.2rem; color: #007BFF; text-decoration: none;">Documentation</a>`,
    );
});

app.use(globalErrorMiddleware);
app.use(resourceNotFound);

const port = PORT || 57000;

async function startSever() {
  try {
    await databaseConnection();
    app.listen(port, () => {
      console.log(`PhotoSnap is running on port ${port}...`);
    });
  } catch (error) {
    throw new Error(`Cannot start the server, ${error.message}`);
  }
}

await startSever();
