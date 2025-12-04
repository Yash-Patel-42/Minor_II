import express from "express";

import requirePermission from "../middlewares/requirePermissionMiddleware";
import { authenticateWorkspace } from "../middlewares/workspaceAuthMiddleware";

import { authenticateUser } from "./../middlewares/authMiddleware";
import {
  fetchInbox,
  handleAcceptInvite,
  handleDeclineInvite,
  handleUserInvite,
} from "./inboxController";

const inboxRouter = express.Router();

inboxRouter.post(
  "/workspace/:workspaceId/invite/user",
  authenticateUser,
  authenticateWorkspace,
  requirePermission("invite_member"),
  handleUserInvite
);
inboxRouter.get("/inbox/user/invite", authenticateUser, fetchInbox);
inboxRouter.post("/inbox/user/invite/accept", authenticateUser, handleAcceptInvite);
inboxRouter.post("/inbox/user/invite/decline", authenticateUser, handleDeclineInvite);

export default inboxRouter;
