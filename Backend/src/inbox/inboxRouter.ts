import { authenticateUser } from "./../middlewares/authMiddleware";
import express from "express";
import {
  handleUserInvite,
  fetchInbox,
  handleAcceptInvite,
  handleDeclineInvite,
} from "./inboxController";
import { authenticateWorkspace } from "../middlewares/workspaceAuthMiddleware";
import requirePermission from "../middlewares/requirePermissionMiddleware";

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
