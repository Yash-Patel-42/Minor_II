import mongoose, { Model } from "mongoose";
import { IMember } from "./workspaceTypes";
const memberSchema = new mongoose.Schema<IMember>(
  {
    userID: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    role: {
      type: String,
      enum: ["owner", "admin", "manager", "editor", "viewer"],
      default: "viewer",
    },
    invitedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    workspaceID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Workspace",
    },
  },
  { timestamps: true }
);
memberSchema.index({ userID: 1, workspaceID: 1 }, { unique: true });
export const Member: Model<IMember> = mongoose.model<IMember>("Member", memberSchema);
