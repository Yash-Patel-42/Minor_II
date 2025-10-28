import { IUser } from "../user/userTypes";
import { IMember, IWorkspace } from "../workspace/workspaceTypes";

declare global {
  namespace Express {
    interface Request {
      user: IUser;
      workspace: IWorkspace;
      member: IMember;
    }
  }
}
