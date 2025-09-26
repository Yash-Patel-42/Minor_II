import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import { verify } from "jsonwebtoken";
import { envConfig } from "../config/config";
import { decodedUser, User } from "../user/userTypes";
import userModel from "../user/userModel";
import { error } from "console";

//Auth Middleware to authenticate user for protected routes.
export const verifyUser = async function (req: Request, res: Response, next: NextFunction) {
  try {
    //Get Access Token From Cookies
    const incomingAccessToken =
      req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
    // Validate Access Token
    if (!incomingAccessToken) {
      return next(createHttpError(401, "Invalid request, provide a valid access token"));
    }
    // Verify Access Token
    let decodedToken: decodedUser;
    try {
      decodedToken = verify(
        incomingAccessToken,
        envConfig.accessTokenSecret as string
      ) as decodedUser;
    } catch (error) {
      return next(createHttpError(401, `Invalid or expired access token: ${error}`));
    }
    //DB Call
    const user:User = await userModel.findById(decodedToken._id).select("-password -refreshToken");
    if (!user) {
      return next(createHttpError(401, `Invalid access token: no user found: ${error}`));
    }
    //Append user in Request
    req.user = user;
    //Call next()
    next();
  } catch (error) {
    next(createHttpError(500, `Something went wrong in auth middleware: ${error}`));
  }
};
