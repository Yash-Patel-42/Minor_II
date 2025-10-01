import { Date, Document, ObjectId } from "mongoose";

export interface IWorkspace extends Document {
  _id: ObjectId;
  workspaceName: string;
  workspaceDescription: string;
  ownerID: ObjectId;
  channelID: string;
  channelEmail: string;
  channelName: string;
  createdAt: Date;
  updatedAt: Date;
}
