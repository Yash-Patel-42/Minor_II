import express from "express";
import { createWorkspace, channelAuthInitiator, channelAuthCallback} from "./workspaceController";
import { verifyUser } from "../middlewares/authMiddleware";

const workspaceRouter = express.Router();

workspaceRouter.post("/workspace", verifyUser, createWorkspace)
workspaceRouter.get("/workspace/auth/google", verifyUser, channelAuthInitiator)
workspaceRouter.get("/workspace/auth/google/callback", verifyUser, channelAuthCallback)

export default workspaceRouter