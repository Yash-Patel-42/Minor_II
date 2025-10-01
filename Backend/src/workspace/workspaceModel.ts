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
    },
    channelID:{
      type: String,
    },
    channelEmail:{
      type:String
    },
    channelName:{
      type:String
    },
  },
  { timestamps: true }
);
export const Workspace = mongoose.model<IWorkspace>("Workspace", workspaceSchema);
