import { Document } from "mongoose";

export interface newUser extends Document {
  _id: string;
  name: string;
  email: string;
  password: string;
  refreshToken?: string;
}
