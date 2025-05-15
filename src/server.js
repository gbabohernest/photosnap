import app from "./app.js";
import { PORT } from "./config/env.config.js";
import databaseConnection from "./config/database.config.js";
import globalErrorMiddleware from "./middleware/error.middleware.js";

app.get("/", (req, res) => {
  res.status(200).json({ success: true, message: "testing works" });
});

app.use(globalErrorMiddleware);

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
