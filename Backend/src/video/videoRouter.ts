import express from "express";
import { authenticateUser } from "../middlewares/authMiddleware";
import { authenticateWorkspace } from "../middlewares/workspaceAuthMiddleware";
import requirePermission from "../middlewares/requirePermissionMiddleware";
import { handleGenerateDescription, handleGenerateTags, handleGeneratetitle, handleVideoUploadToWorkspace } from "./videoController";
import { uploadVideo } from "../utils/multer";

const videoRouter = express.Router();
videoRouter.post("/videos/title/generate", handleGeneratetitle);

videoRouter.post("/videos/description/generate", handleGenerateDescription);

videoRouter.post("/videos/tags/generate", handleGenerateTags);

videoRouter.post(
  "/workspace/:workspaceId/video/upload",
  authenticateUser,
  authenticateWorkspace,
  requirePermission("upload_video"),
  uploadVideo.single("video"),
  handleVideoUploadToWorkspace
);

export default videoRouter;
