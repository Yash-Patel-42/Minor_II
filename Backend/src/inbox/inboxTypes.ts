import { Document, ObjectId } from "mongoose";

export interface IInbox extends Document {
  sender: ObjectId;
  receiver: ObjectId;
  type: string;
  payload: object;
  message: string;
  isRead: boolean;
  response: "accepted" | "declined" | "pending";
}
