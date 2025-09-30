import { Date, Document, ObjectId } from "mongoose";

export interface IWorkspace extends Document {
  _id: ObjectId;
  workspaceName: string;
  workspaceDescription: string;
  ownerID: ObjectId;
  createdAt: Date;
  updatedAt: Date;
}
