import { Document, ObjectId } from "mongoose";

export interface IChatChannel extends Document {
  _id: ObjectId;
  workspaceId: ObjectId;
  name: string;
  description?: string;
  channelType: "general" | "custom_group" | "direct_message";
  members: ObjectId[];
  createdBy: ObjectId;
  isAutoManages: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IChatMessage extends Document {
  _id: ObjectId;
  channelId: ObjectId;
  senderId: ObjectId;
  senderName: string;
  senderAvatar?: string;
  messageContent: string;
  messageType: "text" | "file" | "image" | "system";
  fileUrl?: string;
  isEdited: boolean;
  editedAt?: Date;
  deletedForEveryone: boolean;
  deletedBy: ObjectId[];
  readBy: ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}
