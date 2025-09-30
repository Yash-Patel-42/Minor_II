import express from "express";
import { createWorkspace } from "./workspaceController";
import { verifyUser } from "../middlewares/authMiddleware";

const workspaceRouter = express.Router();

workspaceRouter.post("/workspace", verifyUser, createWorkspace)

export default workspaceRouter