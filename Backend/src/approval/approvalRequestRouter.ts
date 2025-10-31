import express from "express";
import { authenticateUser } from "../middlewares/authMiddleware";
import { authenticateWorkspace } from "../middlewares/workspaceAuthMiddleware";
import {fetchApprovalRequests, handleApproveVideoUploadToYoutubeRequest} from "./approvalRequestController";
import requirePermission from "../middlewares/requirePermissionMiddleware";

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

export default approvalRequestRouter;
