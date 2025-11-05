import mongoose, { Model } from "mongoose";
import { IVideo } from "./videoTypes";

const videoSchema = new mongoose.Schema<IVideo>(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
    thumbnail: {
      type: String,
      required: false,
    },
    tags: {
      type: [String],
      required: false,
    },
    category: {
      type: String,
      required: false,
    },
    privacy: {
      type: String,
      enum: ["public", "private", "unlisted"],
      default: "private",
    },
    uploaderID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    uploadedAt: {
      type: Date,
      default: Date.now,
    },
    workspaceID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Workspace",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "deleted", "re-edit"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export const Video: Model<IVideo> = mongoose.model<IVideo>("Video", videoSchema);
