import mongoose from "mongoose";
import { IWorkspace } from "./workspaceTypes";
const workspaceSchema = new mongoose.Schema<IWorkspace>(
  {
    workspaceName: {
      type: String,
      required: true,
      trim: true,
    },
    workspaceDescription: {
      type: String,
      required: false,
      trim: true,
    },
    ownerID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      trim: true,
      unique: true,
    },
    youtubeChannelID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "YoutubeChannel",
      required: false,
    },
    members: [
      {
        userID: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        role: { type: String, enum: ["admin", "manager", "editor", "viewer"], default: "viewer" },
        status: { type: String, enum: ["active", "pending"], default: "active" },
        invitedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      },
    ],
  },
  { timestamps: true }
);
export const Workspace = mongoose.model<IWorkspace>("Workspace", workspaceSchema);
