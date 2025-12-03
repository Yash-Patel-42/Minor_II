import mongoose, { Model } from "mongoose";
import { IChatChannel } from "./chatTypes";

const chatChannelSchema = new mongoose.Schema<IChatChannel>(
  {
    workspaceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Workspace",
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    channelType: {
      type: String,
      enum: ["general", "custom_group", "direct_message"],
      required: true,
    },
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isAutoManages: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

chatChannelSchema.index({ workspaceId: 1, channelType: 1 });
chatChannelSchema.index({ members: 1 });

export const ChatChannel: Model<IChatChannel> = mongoose.model<IChatChannel>(
  "ChatChannel",
  chatChannelSchema
);
