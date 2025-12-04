import type { Model } from "mongoose";
import mongoose from "mongoose";

import type { IApprovalRequest } from "./approvalRequestTypes";

const approvalRequestSchema = new mongoose.Schema<IApprovalRequest>(
  {
    video: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Video",
      required: true,
    },
    workspace: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Workspace",
    },
    requester: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    approvers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    moderator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "cancelled", "need_edits", "reuploaded"],
      default: "pending",
    },
    response: {
      type: String,
    },
    summary: {
      type: String,
    },
    payload: {
      type: mongoose.Schema.Types.Mixed,
    },
  },
  { timestamps: true }
);

export const ApprovalRequest: Model<IApprovalRequest> = mongoose.model<IApprovalRequest>(
  "ApprovalRequest",
  approvalRequestSchema
);
