import { Request, Response } from "express"
import { HttpError } from "http-errors"
import { envConfig } from "../config/config"

const globalErrorHandler = (err:HttpError, req:Request, res:Response)=>{
    const statusCode = err.statusCode || 500
    return res.status(statusCode).json({
        message: err.message,
        errorStack: envConfig.environment == "development" ? err.stack : "",
    })
}
export default globalErrorHandler