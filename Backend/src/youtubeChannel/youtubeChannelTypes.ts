import type { Date, Document, ObjectId } from "mongoose";

export interface IYoutubeChannel extends Document {
  _id: ObjectId;
  workspaceID: ObjectId;
  googleChannelAccountID: string;
  channelID: string;
  channelName: string;
  channelEmail: string;
  channelToken: object;
  channelRefreshToken: string;
  createdAt: Date;
  updatedAt: Date;
}
