import { NextFunction, Request, Response } from "express";
import { HttpError } from "http-errors";
import { envConfig } from "../config/config";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const globalErrorHandler = (err: HttpError, req: Request, res: Response, _next: NextFunction) => {
  const statusCode = err.statusCode || 500;
  return res.status(statusCode).json({
    message: err.message,
    errorStack: envConfig.environment == "development" ? err.stack : "",
  });
};
export default globalErrorHandler;
