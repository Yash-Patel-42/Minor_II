import express from "express";
import { registerUser, loginUser } from "./userController";

const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser)
export default userRouter;
