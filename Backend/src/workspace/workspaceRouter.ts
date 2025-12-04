import express from "express";

import { authenticateUser } from "../middlewares/authMiddleware";
import requirePermission from "../middlewares/requirePermissionMiddleware";
import { authenticateWorkspace } from "../middlewares/workspaceAuthMiddleware";

import {
  channelAuthCallback,
  channelAuthInitiator,
  createWorkspace,
  fetchAllWorkSpacesDetailForUser,
  fetchSpecificWorkspaceBasedOnId,
  fetchWorkspaceMembers,
  updateWorkspacePermission,
} from "./workspaceController";

const workspaceRouter = express.Router();

workspaceRouter.post("/workspace/create", authenticateUser, createWorkspace);
workspaceRouter.get("/workspace/auth/google", authenticateUser, channelAuthInitiator);
workspaceRouter.get("/workspace/auth/google/callback", authenticateUser, channelAuthCallback);
workspaceRouter.get("/workspaces", authenticateUser, fetchAllWorkSpacesDetailForUser);
workspaceRouter.get("/workspace/:workspaceId", authenticateUser, fetchSpecificWorkspaceBasedOnId);
workspaceRouter.put(
  "/workspace/:workspaceId/update-permissions",
  authenticateUser,
  authenticateWorkspace,
  requirePermission("change_permission"),
  updateWorkspacePermission
);
workspaceRouter.get(
  "/workspace/:workspaceId/members",
  authenticateUser,
  authenticateWorkspace,
  fetchWorkspaceMembers
);

export default workspaceRouter;
