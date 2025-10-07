import { Date, Document, ObjectId } from "mongoose";

export interface IWorkspace extends Document {
  _id: ObjectId;
  workspaceName: string;
  workspaceDescription: string;
  ownerID: ObjectId;
  youtubeChannelID: ObjectId;
  members: ObjectId[];
  createdAt?: Date;
  updatedAt?: Date;
}
export interface IMember extends Document {
  _id: ObjectId;
  userID: ObjectId;
  role: "admin" | "manager" | "editor" | "viewer";
  status: "active" | "pending";
  invitedBy: ObjectId;
  workspaceID: ObjectId;
  updatedAt?: Date;
  createdAt?: Date;
}
