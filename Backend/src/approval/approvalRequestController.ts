import { NextFunction, Request, Response } from "express";
import { ApprovalRequest } from "./approvalRequestModel";
import createHttpError from "http-errors";
import { google } from "googleapis";
import { envConfig } from "../config/config";
import { YoutubeChannel } from "../youtubeChannel/youtubeChannelModel";
import { PassThrough } from "stream";
import axios from "axios";
import { Video } from "../video/videoModel";
import { Workspace } from "../workspace/workspaceModel";

const oauth2Client = new google.auth.OAuth2(
  envConfig.googleClientId,
  envConfig.googleClientSecret,
  envConfig.googleLoginRedirectUri
);

//Fetch Approval Requests for a workspace
const fetchApprovalRequests = async (req: Request, res: Response, next: NextFunction) => {
  const workspaceId = req.params.workspaceId;
  if (!workspaceId) {
    return next(new Error("Workspace ID is required"));
  }
  const approvalRequests = await ApprovalRequest.find({ workspace: workspaceId })
    .populate(
      "video",
      "_id title description url thumbnail uploaderID uploadedAt workspaceID status"
    )
    .populate("requester", "_id name email")
    .populate("approvers", "_id name email")
    .populate("moderator", "_id name email")
    .exec();
  const workspace = await Workspace.findById(workspaceId).populate({
    path: "members",
    populate: [
      { path: "userID", select: "name email _id" },
      { path: "invitedBy", select: "email" },
    ],
  });
  if (!workspace) {
    return next(new Error("Workspace not found"));
  }
  res.status(200).json({ approvalRequests: approvalRequests, workspace: workspace });
};

//Handle Approve Request
const handleApproveVideoUploadToYoutubeRequest = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { req: approvalRequest } = req.body;
    if (!approvalRequest) {
      return next(createHttpError(404, "Approval Request ID is required."));
    }
    if (approvalRequest.status !== "pending")
      return next(createHttpError(401, "Video is not pending pls re-check it."));
    const youtubeChannel = await YoutubeChannel.findOne({ workspaceID: approvalRequest.workspace });
    if (!youtubeChannel) return next(createHttpError(404, "Youtube Channel not found."));
    oauth2Client.setCredentials(youtubeChannel.channelToken);

    const youtube = google.youtube({ version: "v3", auth: oauth2Client });
    const { title, description, url, tags, category, privacy } = approvalRequest.payload;
    if (!title || !description || !url) {
      return next(createHttpError(400, "Incomplete video data in approval request payload."));
    }

    const response = await axios.get(url, { responseType: "stream" });
    const videoStream = new PassThrough();
    response.data.pipe(videoStream);

    const uploadResponse = await youtube.videos.insert({
      part: ["snippet", "status"],
      requestBody: {
        snippet: {
          title,
          description,
          categoryId: category,
          tags,
        },
        status: { privacyStatus: privacy },
      },
      media: { body: videoStream },
    });
    if (uploadResponse.data.status?.uploadStatus === "uploaded") {
      await Video.findOneAndUpdate({ _id: approvalRequest.video._id }, { status: "approved" });
      await ApprovalRequest.findOneAndUpdate(
        { _id: approvalRequest._id },
        {
          status: "approved",
          response: "approved",
          summary: "video approved, uploaded to youtube",
          moderator: req.user._id,
        }
      );
      res.status(200).json({ video: uploadResponse });
    } else {
      res.status(500).json({ message: "Video upload failed." });
    }
  } catch (error) {
    return next(createHttpError(500, `Error uploading video to youtube: ${error}`));
  }
};

//Handle Reject Request
const handleRejectVideoUploadToYoutubeRequest = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { req: approvalRequest } = req.body;
    if (!approvalRequest) return next(createHttpError(404, "Approval Request ID is required."));
    if (approvalRequest.status !== "pending")
      return next(createHttpError(401, "Video is not pending pls re-check it."));

    const youtubeChannel = await YoutubeChannel.findOne({ workspaceID: approvalRequest.workspace });
    if (!youtubeChannel) return next(createHttpError(404, "Youtube Channel not found."));

    await Video.findOneAndUpdate({ _id: approvalRequest.video._id }, { status: "approved" });
    await ApprovalRequest.findOneAndUpdate(
      { _id: approvalRequest._id },
      {
        status: "rejected",
        response: "rejected",
        summary: "video rejected, not uploaded to youtube",
        moderator: req.user._id,
      }
    );
    res.status(200).json({ message: "Video rejected successfully." });
  } catch (error) {
    return next(createHttpError(500, `Error rejecting video upload to youtube: ${error}`));
  }
};

export {
  fetchApprovalRequests,
  handleApproveVideoUploadToYoutubeRequest,
  handleRejectVideoUploadToYoutubeRequest,
};
