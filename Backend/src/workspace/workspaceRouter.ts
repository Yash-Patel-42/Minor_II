import express from "express";
import {
  createWorkspace,
  channelAuthInitiator,
  channelAuthCallback,
  fetchAllWorkSpacesDetailForUser,
  fetchSpecificWorkspaceBasedOnId,
  addUserToWorkspace,
} from "./workspaceController";
import { verifyUser } from "../middlewares/authMiddleware";

const workspaceRouter = express.Router();

workspaceRouter.post("/workspace", verifyUser, createWorkspace);
workspaceRouter.get("/workspace/auth/google", verifyUser, channelAuthInitiator);
workspaceRouter.get("/workspace/auth/google/callback", verifyUser, channelAuthCallback);
workspaceRouter.get("/workspaces", verifyUser, fetchAllWorkSpacesDetailForUser);
workspaceRouter.get("/workspace/:workspaceId", verifyUser, fetchSpecificWorkspaceBasedOnId);
workspaceRouter.post("/workspace/:workspaceId/add/user", addUserToWorkspace);

export default workspaceRouter;
