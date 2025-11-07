import { google } from "googleapis";
import { YoutubeChannel } from "../youtubeChannel/youtubeChannelModel";

export const getAuthorizedYouTubeClient = async (workspaceId: string) => {
  const channelDoc = await YoutubeChannel.findOne({ workspaceID: workspaceId });
  if (!channelDoc || !channelDoc.channelRefreshToken) {
    throw new Error("No refresh token found for this workspace");
  }

  const oAuth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_CHANNEL_AUTH_REDIRECT_URI
  );

  oAuth2Client.setCredentials({
    refresh_token: channelDoc.channelRefreshToken,
  });

  // Create YouTube client
  const youtube = google.youtube({
    version: "v3",
    auth: oAuth2Client,
  });

  return youtube;
};
