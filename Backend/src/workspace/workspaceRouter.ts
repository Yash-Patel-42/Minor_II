import express from "express";
import {
  createWorkspace,
  channelAuthInitiator,
  channelAuthCallback,
  fetchAllWorkSpacesDetailForUser,
  fetchSpecificWorkspaceBasedOnId,
  updateWorkspacePermission,
  fetchWorkspaceMembers
} from "./workspaceController";
import { authenticateUser } from "../middlewares/authMiddleware";
import { authenticateWorkspace } from "../middlewares/workspaceAuthMiddleware";
import requirePermission from "../middlewares/requirePermissionMiddleware";

const workspaceRouter = express.Router();

workspaceRouter.post("/workspace/create", authenticateUser, createWorkspace);
workspaceRouter.get("/workspace/auth/google", authenticateUser, channelAuthInitiator);
workspaceRouter.get("/workspace/auth/google/callback", authenticateUser, channelAuthCallback);
workspaceRouter.get("/workspaces", authenticateUser, fetchAllWorkSpacesDetailForUser);
workspaceRouter.get("/workspace/:workspaceId", authenticateUser, fetchSpecificWorkspaceBasedOnId);
workspaceRouter.put("/workspace/:workspaceId/update-permissions", authenticateUser, authenticateWorkspace, requirePermission("change_permission"), updateWorkspacePermission);
workspaceRouter.get("/workspace/:workspaceId/members", authenticateUser, authenticateWorkspace, fetchWorkspaceMembers);

export default workspaceRouter;
