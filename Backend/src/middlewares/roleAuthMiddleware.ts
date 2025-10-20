import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";

export const roleAuth = async (requiredPermission: Permission) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    //Get data from the req and middleware.
    const userRole = req.memberInfo?.role
    const workspaceId = req.memberInfo?.workspaceID

    //Validate the input
    if(!userRole || !workspaceId) return next(createHttpError(404, "No useRole or workspaceId Received."))

    //DB Calls
    
  };
};
