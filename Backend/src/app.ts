import express, { Request, Response } from "express";
import cookieParser from "cookie-parser";
import globalErrorHandler from "./middlewares/globalErrorHandler";
import userRouter from "./user/userRouter";
import cors from "cors";
import { envConfig } from "./config/config";
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: envConfig.frontendUrl,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  })
);

app.get("/", (req: Request, res: Response) => {
  res.json({ message: "Welcome to Minor-II" });
});
app.use("/api/users", userRouter);

// Global error handler
app.use(globalErrorHandler);
export default app;
