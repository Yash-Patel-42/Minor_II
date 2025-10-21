import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import { Member } from "../workspace/workspaceMemberModel";

export const verifyWorkspace = async function (req: Request, res: Response, next: NextFunction) {
  try {
    const incomingWorkspaceId = req.body;
    const userId = req.user._id;

    if (!incomingWorkspaceId) return next(createHttpError(404, "Invalid or No Workspace ID."));
    if (!userId) return next(createHttpError(404, "Invalid or No userId"));

    const memberInfo = await Member.findOne({
      workspaceID: incomingWorkspaceId,
      userID: userId,
      status: "active",
    });

    if (!memberInfo) return next(createHttpError(401, "You are not a part of this workspace"));

    req.memberInfo = memberInfo;
    next();
  } catch (error) {
    next(createHttpError(500, `Something went wrong in workspace auth middleware: ${error}`));
  }
};
