import { Date, Document, ObjectId } from "mongoose";

export interface IWorkspace extends Document {
  _id: ObjectId;
  workspaceName: string;
  workspaceDescription: string;
  ownerID: ObjectId;
  youtubeChannelID: ObjectId
  members: IMember[]
  createdAt: Date;
  updatedAt: Date;
}
export interface IMember {
  userID: ObjectId
  role: "admin" | "manager" | "editor" | "viewer"
  status: "active" | "pending"
  invitedBy: ObjectId
}