import { User } from "../user/userTypes";

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}
