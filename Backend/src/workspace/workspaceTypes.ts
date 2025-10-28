import { Date, Document, ObjectId } from "mongoose";

export type RoleType = "owner" | "admin" | "manager" | "editor" | "viewer";

export type PermissionMatrix = {
  [role in RoleType]: {
    [permission: string]: boolean;
  };
};

export interface IWorkspace extends Document {
  _id: ObjectId;
  workspaceName: string;
  workspaceDescription: string;
  ownerID: ObjectId;
  youtubeChannelID: ObjectId;
  members: ObjectId[];
  permissionMatrix: PermissionMatrix;
  createdAt?: Date;
  updatedAt?: Date;
}
export interface IMember extends Document {
  _id: ObjectId;
  userID: ObjectId;
  role: "owner" | "admin" | "manager" | "editor" | "viewer";
  invitedBy: ObjectId;
  workspaceID: ObjectId;
  status: "pending" | "active";
  acceptedAt: Date;
  roleHistory: [];
  updatedAt?: Date;
  createdAt?: Date;
}
