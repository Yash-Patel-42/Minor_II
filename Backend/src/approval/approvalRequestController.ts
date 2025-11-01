import { NextFunction, Request, Response } from "express";
import { ApprovalRequest } from "./approvalRequestModel";
import createHttpError from "http-errors";
import { google } from "googleapis";
import { envConfig } from "../config/config";
import { YoutubeChannel } from "../youtubeChannel/youtubeChannelModel";
import { PassThrough } from "stream";
import axios from "axios";

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
    .exec();
  console.log(approvalRequests);
  res.status(200).json({ approvalRequests: approvalRequests });
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

    const youtubeChannel = await YoutubeChannel.findOne({ workspaceID: approvalRequest.workspace });
    if (!youtubeChannel) {
      return next(createHttpError(404, "Youtube Channel not found."));
    }
    oauth2Client.setCredentials(youtubeChannel.channelToken);

    const youtube = google.youtube({ version: "v3", auth: oauth2Client });
    const { title, description, url } = approvalRequest.payload;
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
          categoryId: "22",
        },
        status: { privacyStatus: "private" },
      },
      media: { body: videoStream },
    });
    console.log("approvalRequestController:74 Youtube Upload Response: ",uploadResponse);
    res.status(200).json({ video: uploadResponse });
  } catch (error) {
    return next(createHttpError(500, `Error uploading video to youtube: ${error}`));
  }
};
export { fetchApprovalRequests, handleApproveVideoUploadToYoutubeRequest };
