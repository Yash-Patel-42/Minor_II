import express from "express";
import { authenticateUser } from "../middlewares/authMiddleware";
import { authenticateWorkspace } from "../middlewares/workspaceAuthMiddleware";
import requirePermission from "../middlewares/requirePermissionMiddleware";
import { handleVideoUploadToWorkspace } from "./videoController";

const videoRouter = express.Router();

videoRouter.post(
  "",
  authenticateUser,
  authenticateWorkspace,
  requirePermission("upload_video"),
  handleVideoUploadToWorkspace
);

export default videoRouter;
