import express from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  userHome,
  googleLoginInitiator,
  googleLoginCallback,
} from "./userController";
import { verifyUser } from "../middlewares/authMiddleware";

const userRouter = express.Router();

//Auth Routes
userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.post("/logout", logoutUser);
userRouter.post("/refresh-token", refreshAccessToken);
userRouter.get("/auth/google", googleLoginInitiator);
userRouter.get("/auth/google/callback", googleLoginCallback);

userRouter.get("/home", verifyUser, userHome);

export default userRouter;
