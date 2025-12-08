import { Router } from "express";

import { authenticateUser } from "../middlewares/authMiddleware";
import { authenticateWorkspace } from "../middlewares/workspaceAuthMiddleware";

import { getChannelInfoHandler } from "./youtubeChannelController";

const youtubeChannelRouter = Router();

// Expect workspaceId as a route param so authenticateWorkspace can validate membership
// Final path becomes: /api/channel/info/:workspaceId
youtubeChannelRouter.get(
  "/info/:workspaceId",
  authenticateUser,
  authenticateWorkspace,
  getChannelInfoHandler
);

export default youtubeChannelRouter;
