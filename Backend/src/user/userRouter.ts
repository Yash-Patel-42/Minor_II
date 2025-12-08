import express from "express";

import { authenticateUser } from "./../middlewares/authMiddleware";
import {
  googleLoginCallback,
  googleLoginInitiator,
  loginUser,
  logoutUser,
  refreshAccessToken,
  registerUser,
  userHome,
} from "./userController";

const userRouter = express.Router();

//Auth Routes
userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.post("/logout", logoutUser);
userRouter.post("/refresh-token", refreshAccessToken);
userRouter.get("/auth/google", googleLoginInitiator);
userRouter.get("/auth/google/callback", googleLoginCallback);

userRouter.get("/home", authenticateUser, userHome);

export default userRouter;
