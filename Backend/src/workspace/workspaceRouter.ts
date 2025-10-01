import express from "express";
import { createWorkspace, channelAuthInitiator, channelAuthCallback, fetchWorkspacesDetail} from "./workspaceController";
import { verifyUser } from "../middlewares/authMiddleware";

const workspaceRouter = express.Router();

workspaceRouter.post("/workspace", verifyUser, createWorkspace)
workspaceRouter.get("/workspace/auth/google", verifyUser, channelAuthInitiator)
workspaceRouter.get("/workspace/auth/google/callback", verifyUser, channelAuthCallback)
workspaceRouter.get("/workspaces", verifyUser, fetchWorkspacesDetail)

export default workspaceRouter