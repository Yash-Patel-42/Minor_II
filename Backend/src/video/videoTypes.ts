import { ObjectId } from "mongoose";

export interface IVideo {
  title: string;
  description: string;
  url: string;
  thumbnail: string;
  uploaderID: ObjectId;
  uploadedAt: Date;
  workspaceID: ObjectId;
  status: "pending" | "approved" | "rejected" | "deleted" | "re-edit";
}
