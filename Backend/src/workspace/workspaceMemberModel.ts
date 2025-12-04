import type { Model } from "mongoose";
import mongoose from "mongoose";

import type { IMember } from "./workspaceTypes";
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
    status: {
      type: String,
      enum: ["active", "pending"],
      default: "pending",
    },
    acceptedAt: {
      type: Date,
    },
    roleHistory: [{ role: String, changedBy: mongoose.Schema.Types.ObjectId, changedAt: Date }],
  },
  { timestamps: true }
);
memberSchema.index({ userID: 1, workspaceID: 1 }, { unique: true });
export const Member: Model<IMember> = mongoose.model<IMember>("Member", memberSchema);
