import express from "express";

import { authenticateUser } from "../middlewares/authMiddleware";
import { authenticateWorkspace } from "../middlewares/workspaceAuthMiddleware";

import {
  createChannel,
  fetchAllChannelsForUser,
  fetchChannelMessages,
  sendMessage,
} from "./chatController";
const chatRouter = express.Router();

chatRouter.post(
  "/workspace/:workspaceId/chat-channel/create",
  authenticateUser,
  authenticateWorkspace,
  createChannel
);
chatRouter.get(
  "/workspace/:workspaceId/chat-channels",
  authenticateUser,
  authenticateWorkspace,
  fetchAllChannelsForUser
);
chatRouter.get(
  "/workspace/:workspaceId/chat-channel/:chatChannelId/messages",
  authenticateUser,
  authenticateWorkspace,
  fetchChannelMessages
);
chatRouter.post(
  "/workspace/:workspaceId/chat-channel/:chatChannelId/send-message",
  authenticateUser,
  authenticateWorkspace,
  sendMessage
);

export default chatRouter;
