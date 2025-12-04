import express from "express";

import { authenticateUser } from "../middlewares/authMiddleware";
import requirePermission from "../middlewares/requirePermissionMiddleware";
import { authenticateWorkspace } from "../middlewares/workspaceAuthMiddleware";
import { uploadVideo } from "../utils/multer";

import {
  fetchAllVideosForUser,
  fetchAllVideosForWorkspace,
  handleGenerateDescription,
  handleGenerateTags,
  handleGeneratetitle,
  handleVideoUploadToWorkspace,
} from "./videoController";

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
videoRouter.get("/videos", authenticateUser, fetchAllVideosForUser);
videoRouter.get(
  "/videos/:workspaceId",
  authenticateUser,
  authenticateWorkspace,
  fetchAllVideosForWorkspace
);

export default videoRouter;
