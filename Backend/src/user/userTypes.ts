import type { JwtPayload } from "jsonwebtoken";
import type { Document } from "mongoose";

export interface IUser extends Document {
  _id: string;
  name: string;
  email: string;
  password: string;
  googleAccountID: string;
  avatar?: string;
  refreshToken: string;
}

export interface IDecodedUser extends JwtPayload {
  _id: string;
  _email: string;
}
