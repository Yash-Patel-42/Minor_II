import { NextFunction, Request, Response } from "express";
import bcrypt from "bcrypt"
import createHttpError from "http-errors";
import userModel from "./userModel";

const createUser = async (req: Request, res: Response, next: NextFunction) => {
  const { name, email, password } = req.body;
  //Validation
  if (!name || !email || !password) {
    const error = createHttpError(400, "All fields are required.");
    return next(error);
  }
  // Database Calls
  const user = await userModel.findOne({email})
  if(user){
    const error = createHttpError(400, "User already exist with this email.")
    return next(error)
  }
  //Password Hashing
  const hashedPassword = await bcrypt.hash(password, 10)
  //Process
  //Response
  res.json({ message: "User Registered" });
};
export { createUser };
