import { ObjectId } from "mongoose";

export interface IApprovalRequest {
  video: ObjectId;
  workspace: ObjectId;
  requester: ObjectId;
  approvers: ObjectId[];
  status: "pending" | "approved" | "rejected" | "cancelled" | "need_edits" | "reuploaded";
  response: string;
  summary: string;
  payload: object;
}
