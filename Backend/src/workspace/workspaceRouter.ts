import express from "express";
import {
  createWorkspace,
  channelAuthInitiator,
  channelAuthCallback,
  fetchAllWorkSpacesDetailForUser,
  fetchSpecificWorkspaceBasedOnId,
} from "./workspaceController";
import { authenticateUser } from "../middlewares/authMiddleware";

const workspaceRouter = express.Router();

workspaceRouter.post("/workspace/create", authenticateUser, createWorkspace);
workspaceRouter.get("/workspace/auth/google", authenticateUser, channelAuthInitiator);
workspaceRouter.get("/workspace/auth/google/callback", authenticateUser, channelAuthCallback);
workspaceRouter.get("/workspaces", authenticateUser, fetchAllWorkSpacesDetailForUser);
workspaceRouter.get("/workspace/:workspaceId", authenticateUser, fetchSpecificWorkspaceBasedOnId);

export default workspaceRouter;
