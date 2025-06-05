import express from "express";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.routes.js";
import meRouter from "./routes/me.routes.js";
import publicRouter from "./routes/public.routes.js";
import adminRouter from "./routes/admin.routes.js";
import sanitizeMiddleware from "./middleware/sanitize.middleware.js";
import limiter from "./middleware/rate-limit.middleware.js";
import helmet from "helmet";
import cors from "cors";
import path from "node:path";

import YAML from "yamljs";
import { fileURLToPath } from "url";
import swaggerUi from "swagger-ui-express";

const app = express();
app.set("trust proxy", 1);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const apiDoc = YAML.load(path.join(__dirname, "swagger.yaml"));

app.use(limiter);
app.use(express.json());
app.use(helmet());
app.use(cors({ origin: true, credentials: true }));
app.use(sanitizeMiddleware);
app.use(cookieParser());

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/me", meRouter);
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/public", publicRouter);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(apiDoc));

export default app;
