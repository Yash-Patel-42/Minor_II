import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import { IWorkspace } from "./workspaceTypes";
import { Workspace } from "./workspaceModel";

const createWorkspace = async (req: Request, res: Response, next: NextFunction) => {
  const { workspaceName, workspaceDescription, ownerID} = req.body;
  if (!workspaceName || !workspaceDescription || !ownerID) {
    return next(createHttpError(400, "UserID, name and email is required to create a workspace."));
  }
  let workspace: IWorkspace;
  let populatedWorkspace
  try {
    workspace = await Workspace.create({
      workspaceName: workspaceName,
      workspaceDescription: workspaceDescription,
      ownerID: ownerID,
    });
    populatedWorkspace = await workspace.populate("ownerID", "name email")
  } catch (error) {
    return next(createHttpError(500, `Error creation workspace: ${error}`));
  }
  res
    .status(201)
    .json({workspace:populatedWorkspace});
};

export { createWorkspace };
