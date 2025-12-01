import express from "express";
import { authenticateUser } from "../middlewares/authMiddleware";
import { authenticateWorkspace } from "../middlewares/workspaceAuthMiddleware";
import { fetchAllChannelsForUser } from "./chatController";
const chatRouter = express.Router();

chatRouter.get("/channels", authenticateUser, authenticateWorkspace, fetchAllChannelsForUser)

export default chatRouter;
