import { newUser } from "../user/userTypes";

declare global {
  namespace Express {
    interface Request {
      user?: newUser;
    }
  }
}
