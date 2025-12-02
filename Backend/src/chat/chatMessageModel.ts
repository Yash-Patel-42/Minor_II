import mongoose, { Model } from "mongoose";
import { IChatMessage } from "./chatTypes";

const chatMessageSchema = new mongoose.Schema<IChatMessage>(
  {
    channelId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ChatChannel",
      required: true,
      index: true,
    },
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    senderName: {
      type: String,
      required: true,
    },
    senderAvatar: {
      type: String,
    },
    messageContent: {
      type: String,
      required: true,
    },
    messageType: {
      type: String,
      enum: ["text", "file", "image", "system"],
      default: "text",
    },
    fileUrl: {
      type: String,
    },
    isEdited: {
      type: Boolean,
      default: false,
    },
    editedAt: {
      type: Date,
    },
    deletedForEveryone: {
      type: Boolean,
      default: false,
    },
    deletedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    readBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

chatMessageSchema.index({ channelId: 1, createdAt: -1 });

export const ChatMessage: Model<IChatMessage> = mongoose.model<IChatMessage>(
  "ChatMessage",
  chatMessageSchema
);
