import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import { Member } from "../workspace/workspaceMemberModel";
import { Workspace } from "../workspace/workspaceModel";

export const authenticateWorkspace = async function (req: Request, res: Response, next: NextFunction) {
  try {
    const incomingWorkspaceId = req.params.workspaceId;
    const userId = req.user._id;

    if (!incomingWorkspaceId) return next(createHttpError(404, "Invalid or No Workspace ID."));
    if (!userId) return next(createHttpError(404, "Invalid or No userId"));

    const workspace = await Workspace.findById(incomingWorkspaceId);
    if (!workspace) return next(createHttpError(404, "Workspace not found"));

    const member = await Member.findOne({
      workspaceID: incomingWorkspaceId,
      userID: userId,
      status: "active",
    });

    if (!member)
      return next(createHttpError(401, "Access Denied: You are not a part of this workspace"));

    req.workspace = workspace;
    req.member = member;
    next();
  } catch (error) {
    next(createHttpError(500, `Something went wrong in workspace validation: ${error}`));
  }
};
