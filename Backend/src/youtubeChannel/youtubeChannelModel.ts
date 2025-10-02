import mongoose from "mongoose";
import { IYoutubeChannel } from "./youtubeChannelTypes";
const youtubeChannelSchema = new mongoose.Schema<IYoutubeChannel>(
  {
    workspaceID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Workspace",
      required: true,
      unique: true,
    },
    googleChannelAccountID: {
      type: String,
      required: true,
      unique: true,
    },
    channelID: {
      type: String,
      required: true,
      unique: true,
    },
    channelName: {
      type: String,
      required: true,
    },
    channelEmail: {
      type: String,
      required: true,
    },
    channelRefreshToken: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);
export const YoutubeChannel = mongoose.model<IYoutubeChannel>(
  "YoutubeChannel",
  youtubeChannelSchema
);
