import { Router } from "express";
import { getChannelInfoHandler } from "./youtubeChannelController";
import { authenticateUser } from "../middlewares/authMiddleware";
import { authenticateWorkspace } from "../middlewares/workspaceAuthMiddleware";

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
