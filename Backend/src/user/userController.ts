import { NextFunction, Request, Response } from "express";
import userModel from "./userModel";
import { sign } from "jsonwebtoken";
import { envConfig } from "../config/config";
import { User } from "./userTypes";
import createHttpError from "http-errors";
import bcrypt from "bcrypt";

//Register Handler
const registerUser = async (req: Request, res: Response, next: NextFunction) => {
  const { name, email, password } = req.body;
  let newUser: User;
  //Validation
  if (!name || !email || !password) {
    return next(createHttpError(400, "All fields are required."));
  }
  // Database Checking Calls
  try {
    const user = await userModel.findOne({ email: email });
    if (user) {
      return next(createHttpError(400, "User already exist with this email."));
    }
  } catch (error) {
    return next(createHttpError(500, `Error while getting user: ${error}`));
  }
  //Password Hashing
  const hashedPassword = await bcrypt.hash(password, 10);

  //Database Save User
  try {
    newUser = await userModel.create({
      name,
      email,
      password: hashedPassword,
    });
  } catch (error) {
    return next(createHttpError(500, `Error Creating User: ${error}`));
  }
  //Token Generation
  try {
    const accessToken = sign({ sub: newUser._id }, envConfig.jwtSecret as string, {
      expiresIn: "7d",
      algorithm: "HS256",
    });
    //Response
    res.status(201).json({ accessToken: accessToken });
  } catch (error) {
    return next(createHttpError(500, `Error Creating accessToken: ${error}`));
  }
};

//Login Handler
const loginUser = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;
  let user;
  //Validation
  if (!email || !password) {
    return next(createHttpError(400, "All fields are required."));
  }
  //Database Calls
  try {
    user = await userModel.findOne({ email });
    if (!user) {
      return next(createHttpError(404, "User not found."));
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return next(createHttpError(400, "Username or password incorrect."));
    }
  } catch (error) {
    return next(createHttpError(500, `Error fetching user data: ${error}`));
  }
  //Token Generation
  try {
    const accessToken = sign({ sub: user._id }, envConfig.jwtSecret as string, {
      expiresIn: "7d",
      algorithm: "HS256",
    });
    //Response
    res.json({ accessToken: accessToken });
  } catch (error) {
    return next(createHttpError(500, `Error generating access token: ${error}`));
  }
};
export { registerUser, loginUser };
