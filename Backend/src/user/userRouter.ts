import express from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  userHome,
} from "./userController";
import { verifyUser } from "../middlewares/authMiddleware";

const userRouter = express.Router();

//Auth Routes
userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.post("/logout", logoutUser);
userRouter.post("/refresh-token", refreshAccessToken);

userRouter.get("/home", verifyUser, userHome);

export default userRouter;
