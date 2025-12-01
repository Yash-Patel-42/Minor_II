import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";

const fetchAllChannelsForUser = async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.user._id;
  const workspaceId = req.workspace._id;
  if (!userId || !workspaceId) {
    return next(createHttpError(400, "User ID and workspace ID are required"));
  }
};

export { fetchAllChannelsForUser };
