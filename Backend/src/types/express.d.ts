import { IUser } from "../user/userTypes";
import { IMember } from "../workspace/workspaceTypes";

declare global {
  namespace Express {
    interface Request {
      user: IUser;
      memberInfo?: IMember;
    }
  }
}
