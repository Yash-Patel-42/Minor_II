import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import cloudinary from "../config/cloudinary";
import fs from "fs";
import { Video } from "./videoModel";
import { Member } from "../workspace/workspaceMemberModel";
import { ApprovalRequest } from "../approval/approvalRequestModel";
import { AxiosResponse } from "../types/axios.types";
import { api } from "../utils/axiosInstance.utils";

const handleGeneratetitle = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const title = req.body.data as string;

    if (!title) return next(createHttpError(400, "Title is required"));

    const response = await api.post<AxiosResponse>("/api/v1/agent/generatetitle", {
      prompt: title,
    });

    // console.log("res ==>", response.data.data)

    res.status(200).json({ title: response.data.data });
  } catch (error) {
    return next(createHttpError(500, `Error generating title: ${error}`));
  }
};

const handleGenerateDescription = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const description = req.body.data as string;
    if (!description) return next(createHttpError(400, "Title is required"));

    const response = await api.post<AxiosResponse>("/api/v1/agent/generate-description", {
      prompt: description,
    });
    // console.log("res ==>", response.data);
    res.status(200).json({ description: response.data.data });
  } catch (error) {
    return next(createHttpError(500, `Error generating description: ${error}`));
  }
};

const handleGenerateTags = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const title = req.body.data as string;
    if (!title) return next(createHttpError(400, "Title is required"));

    const response = await api.post<AxiosResponse>("/api/v1/agent/generate-tags", {
      prompt: title,
    });
    console.log("res ==>", response.data);
    res.status(200).json({ tags: response.data.data });
  } catch (error) {
    return next(createHttpError(500, `Error generating tags: ${error}`));
  }
};

const handleVideoUploadToWorkspace = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const file = req.file;
    if (!file) return next(createHttpError(404, "No file found to upload"));

    const workspaceId = req.workspace._id;
    const userId = req.user._id;
    if (!workspaceId || !userId) return next(createHttpError(404, "No workspace or user found"));

    const result = await cloudinary.uploader.upload(file.path, {
      resource_type: "video",
      folder: `workspace_${workspaceId}/videos`,
      public_id: `${Date.now()}_${file.originalname.split(".")[0]}`,
      chunk_size: 6000000,
    });

    fs.unlink(file.path, (error) => {
      if (error) console.warn("Failed to delete temp file:", error);
    });

    const videoUrl = result.secure_url;
    const thumbnailUrl = cloudinary.url(result.public_id, {
      resource_type: "video",
      format: "jpg",
      transformation: [{ width: 640, height: 360, crop: "fill" }],
    });

    const video = await Video.create({
      title: req.body.title,
      description: req.body.description,
      url: videoUrl,
      thumbnail: thumbnailUrl,
      tags: req.body.tags,
      category: req.body.category,
      privacy: req.body.privacy,
      uploaderID: userId,
      workspaceID: workspaceId,
    });

    //Get permission matrix from req.workspace
    const permissionMatrix = req.workspace.permissionMatrix;

    //Find roles who can accept or decline video request so we can send them inbox
    const rolesWithPermissionToReviewRequest: string[] = [];
    for (const [role, perm] of Object.entries(permissionMatrix)) {
      if (
        perm["accept_video_upload_request"] === true ||
        perm["reject_video_upload_request"] === true
      ) {
        rolesWithPermissionToReviewRequest.push(role);
      }
    }

    // Find userID of these roles from Member model
    const permittedMembers = await Member.find({
      _id: { $in: req.workspace.members },
      role: { $in: rolesWithPermissionToReviewRequest },
    }).populate("userID", "_id");

    //Map over userID to finally send Inbox
    const receiverIDs = permittedMembers.map((m) => m.userID);

    const approvalRequest = await ApprovalRequest.create({
      video: video._id,
      workspace: workspaceId,
      requester: userId,
      approvers: receiverIDs,
      status: "pending",
      response: "pending",
      summary: "Pending for review",
      payload: {
        title: video.title,
        description: video.description,
        url: video.url,
        thumbnail: video.thumbnail,
        uploaderID: video.uploaderID,
        uploadedAt: video.uploadedAt,
        workspaceID: video.workspaceID,
      },
    });

    res.status(201).json({
      message: "Video uploaded successfully & pending for review",
      video: video,
      inbox: approvalRequest,
    });
  } catch (error) {
    next(createHttpError(500, `Error uploading video: ${error}`));
  }
};

export {
  handleVideoUploadToWorkspace,
  handleGeneratetitle,
  handleGenerateDescription,
  handleGenerateTags,
};
