import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import { RoleType } from "../workspace/workspaceTypes";

const requirePermission =
  (permission: string) => (req: Request, res: Response, next: NextFunction) => {
    const workspace = req.workspace;
    const member = req.member;
    if (!workspace || !member) return next(createHttpError(404, "Invalid workspace or member"));

    const permissionMatrix = workspace.permissionMatrix;
    const role = member.role as RoleType;

    const rolePermission = permissionMatrix?.[role];
    if (!rolePermission)
      return next(createHttpError(401, `No permissions defined for role: ${role}`));

    const hasPermission = rolePermission[permission];
    if (!hasPermission)
      return next(createHttpError(401, `Role ${role} does not have permission for: ${permission}`));

    next();
  };
export default requirePermission;
