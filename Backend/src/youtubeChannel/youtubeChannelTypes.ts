import { Date, Document, ObjectId } from "mongoose";

export interface IYoutubeChannel extends Document {
  _id: ObjectId;
  workspaceID: ObjectId;
  googleAccountID: string;
  channelID: string;
  channelName: string;
  channelEmail: string;
  refreshToken: string
  createdAt: Date;
  updatedAt: Date;
}
