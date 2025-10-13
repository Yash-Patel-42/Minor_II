import mongoose, { Model } from "mongoose";
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
    },
    youtubeChannelID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "YoutubeChannel",
      required: false,
    },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: "Member" }],
  },
  { timestamps: true }
);
export const Workspace: Model<IWorkspace> = mongoose.model<IWorkspace>(
  "Workspace",
  workspaceSchema
);
