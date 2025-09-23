import express, { Request, Response } from "express";
import globalErrorHandler from "./middlewares/globalErrorHandler";
const app = express();

app.get("/", (req:Request, res:Response) => {
  res.json({ message: "Welcome to Minor-II" });
});

// Global error handler
app.use(globalErrorHandler);
export default app;
