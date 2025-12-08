import type { IUser } from "../user/userTypes";
import type { IMember, IWorkspace } from "../workspace/workspaceTypes";

declare global {
  namespace Express {
    interface Request {
      user: IUser;
      workspace: IWorkspace;
      member: IMember;
    }
  }
}
