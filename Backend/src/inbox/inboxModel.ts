import mongoose, { Model } from "mongoose";
import { IInbox } from "./inboxTypes";

const inboxSchema = new mongoose.Schema<IInbox>(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    type: {
      type: String,
      required: true,
    },
    payload: {
      type: mongoose.Schema.Types.Mixed,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export const Inbox: Model<IInbox> = mongoose.model<IInbox>("Inbox", inboxSchema);
