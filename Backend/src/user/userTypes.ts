import { JwtPayload } from "jsonwebtoken";
import { Document } from "mongoose";

export interface newUser extends Document {
  _id: string;
  name: string;
  email: string;
  password: string;
  refreshToken?: string;
}
export interface decodedUser extends JwtPayload {
  _id: string;
  _email: string;
}
