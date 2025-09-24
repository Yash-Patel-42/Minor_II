import express from "express";
import { registerUser, loginUser, logoutUser, refreshAccessToken } from "./userController";

const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.post("/logout", logoutUser);
userRouter.post("/refresh-token", refreshAccessToken);
export default userRouter;
