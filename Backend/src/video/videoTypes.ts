import { ObjectId } from "mongoose";

export interface IVideo {
  title: string;
  description: string;
  url: string;
  thumbnail: string;
  tags: string[];
  category: string;
  privacy: "public" | "private" | "unlisted";
  uploaderID: ObjectId;
  uploadedAt: Date;
  workspaceID: ObjectId;
  status: "pending" | "approved" | "rejected" | "deleted" | "re-edit";
}