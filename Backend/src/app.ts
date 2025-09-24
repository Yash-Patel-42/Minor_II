import express, { Request, Response } from "express";
import cookieParser from "cookie-parser";
import globalErrorHandler from "./middlewares/globalErrorHandler";
import userRouter from "./user/userRouter";

const app = express();
app.use(express.json());
app.use(cookieParser());

app.get("/", (req: Request, res: Response) => {
  res.json({ message: "Welcome to Minor-II" });
});
app.use("/api/users", userRouter);

// Global error handler
app.use(globalErrorHandler);
export default app;
