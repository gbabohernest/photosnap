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

const app = express();
app.set("trust proxy", 1);

app.use(limiter);
app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(sanitizeMiddleware);
app.use(cookieParser());

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/me", meRouter);
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/public", publicRouter);

export default app;
