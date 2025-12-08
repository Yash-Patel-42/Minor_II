import type { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";

import { getAuthorizedYouTubeClient } from "../utils/youtubeClient";

export const getChannelInfoHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    console.log("inside info controller: ");

    const workspaceId = req.workspace?._id?.toString() || (req.query.workspaceId as string);
    if (!workspaceId) {
      return next(createHttpError(400, "Workspace ID is required or invalid."));
    }

    const youtube = await getAuthorizedYouTubeClient(workspaceId);

    const response = await youtube.channels.list({
      part: ["snippet", "statistics"],
      mine: true,
    });

    const channel = response.data.items?.[0];
    if (!channel) {
      return next(createHttpError(404, "No YouTube channel found for this workspace."));
    }

    const channelInfo = {
      channelId: channel.id,
      channelName: channel.snippet?.title,
      channelDescription: channel.snippet?.description,
      subscribers: channel.statistics?.subscriberCount,
      views: channel.statistics?.viewCount,
      totalVideos: channel.statistics?.videoCount,
      thumbnails: channel.snippet?.thumbnails,
    };

    return res.status(200).json({
      success: true,
      message: "Channel info fetched successfully.",
      channel: channelInfo,
    });
  } catch (error) {
    console.error("Error fetching channel info:", error);
    return next(createHttpError(500, `Error fetching YouTube channel info: ${error}`));
  }
};
