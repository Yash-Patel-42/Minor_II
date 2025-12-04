import express from "express";

import { authenticateUser } from "../middlewares/authMiddleware";
import requirePermission from "../middlewares/requirePermissionMiddleware";
import { authenticateWorkspace } from "../middlewares/workspaceAuthMiddleware";

import {
  fetchApprovalRequests,
  handleApproveVideoUploadToYoutubeRequest,
  handleRejectVideoUploadToYoutubeRequest,
} from "./approvalRequestController";

const approvalRequestRouter = express.Router();

approvalRequestRouter.get(
  "/workspace/:workspaceId/upload-requests",
  authenticateUser,
  authenticateWorkspace,
  fetchApprovalRequests
);
approvalRequestRouter.post(
  "/workspace/:workspaceId/approval-requests/approve",
  authenticateUser,
  authenticateWorkspace,
  requirePermission("accept_video_upload_request"),
  handleApproveVideoUploadToYoutubeRequest
);
approvalRequestRouter.post(
  "/workspace/:workspaceId/approval-requests/reject",
  authenticateUser,
  authenticateWorkspace,
  requirePermission("reject_video_upload_request"),
  handleRejectVideoUploadToYoutubeRequest
);

export default approvalRequestRouter;
