import express from "express";
import {
  createWorkspace,
  channelAuthInitiator,
  channelAuthCallback,
  fetchAllWorkSpacesDetailForUser,
  fetchSpecificWorkspaceBasedOnId,
} from "./workspaceController";
import { verifyUser } from "../middlewares/authMiddleware";

const workspaceRouter = express.Router();

workspaceRouter.post("/workspace/create", verifyUser, createWorkspace);
workspaceRouter.get("/workspace/auth/google", verifyUser, channelAuthInitiator);
workspaceRouter.get("/workspace/auth/google/callback", verifyUser, channelAuthCallback);
workspaceRouter.get("/workspaces", verifyUser, fetchAllWorkSpacesDetailForUser);
workspaceRouter.get("/workspace/:workspaceId", verifyUser, fetchSpecificWorkspaceBasedOnId);

export default workspaceRouter;
