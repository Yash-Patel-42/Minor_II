import express from "express";
import { authenticateUser } from "../middlewares/authMiddleware";
import { authenticateWorkspace } from "../middlewares/workspaceAuthMiddleware";
import requirePermission from "../middlewares/requirePermissionMiddleware";
import { handleGenerateDescription, handleGeneratetitle, handleVideoUploadToWorkspace } from "./videoController";
import { uploadVideo } from "../utils/multer";

const videoRouter = express.Router();

videoRouter.get(
  "/videos/title/generate",
  authenticateUser,
  authenticateWorkspace,
  handleGeneratetitle
);

videoRouter.get(
  "videos/desription/generate",
  authenticateUser,
  authenticateWorkspace,
  handleGenerateDescription
);

videoRouter.post(
  "/workspace/:workspaceId/video/upload",
  authenticateUser,
  authenticateWorkspace,
  requirePermission("upload_video"),
  uploadVideo.single("video"),
  handleVideoUploadToWorkspace
);

export default videoRouter;
