import express from "express";
import { authenticateUser } from "../middlewares/authMiddleware";
import { authenticateWorkspace } from "../middlewares/workspaceAuthMiddleware";
import requirePermission from "../middlewares/requirePermissionMiddleware";
import { handleVideoUploadToWorkspace } from "./videoController";
import { uploadVideo } from "../utils/multer";

const videoRouter = express.Router();

videoRouter.post(
  "/workspace/:workspaceId/video/upload",
  authenticateUser,
  authenticateWorkspace,
  requirePermission("upload_video"),
  uploadVideo.single("video"),
  handleVideoUploadToWorkspace
);

export default videoRouter;
