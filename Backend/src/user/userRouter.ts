import express from "express";
import { registerUser, loginUser, logoutUser } from "./userController";

const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser)
userRouter.post("/logout", logoutUser)
export default userRouter;
