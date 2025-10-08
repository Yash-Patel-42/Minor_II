import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import { Workspace } from "./workspaceModel";
import { envConfig } from "../config/config";
import { OAuth2Client } from "google-auth-library";
import { google } from "googleapis";
import { YoutubeChannel } from "../youtubeChannel/youtubeChannelModel";

//Create Workspace
const createWorkspace = async (req: Request, res: Response, next: NextFunction) => {
  const { workspaceName, workspaceDescription, ownerID } = req.body;
  if (!workspaceName || !workspaceDescription || !ownerID) {
    return next(createHttpError(400, "UserID, name and email is required to create a workspace."));
  }
  try {
    const newWorkspace = await Workspace.create({
      workspaceName: workspaceName,
      workspaceDescription: workspaceDescription,
      ownerID: ownerID,
    });
    res.status(201).json({ workspace: newWorkspace });
  } catch (error) {
    return next(createHttpError(500, `Error creation workspace: ${error}`));
  }
};

//Google Auth
const oAuth2Client = new OAuth2Client({
  clientId: envConfig.googleClientId,
  clientSecret: envConfig.googleClientSecret,
  redirectUri: envConfig.googleChannelAuthRedirectUri,
});

//Frontend will make request on this route.
const channelAuthInitiator = (req: Request, res: Response, next: NextFunction) => {
  const { workspaceId } = req.query;
  if (!workspaceId) {
    return next(createHttpError(400, "Workspace ID is required."));
  }
  const redirectURL = oAuth2Client.generateAuthUrl({
    assess_type: "offline",
    prompt: "consent",
    scope: [
      "openid",
      "profile",
      "email",
      "https://www.googleapis.com/auth/youtube",
      "https://www.googleapis.com/auth/youtube.readonly",
      "https://www.googleapis.com/auth/youtube.upload",
    ],
    state: workspaceId as string,
  });
  if (!redirectURL) return next(createHttpError(500, "Error generating google redirectURL"));
  // we will redirect to this generated route.
  res.redirect(redirectURL);
};

//Google will provide a callback on the generated route, so we can listen that here.
const channelAuthCallback = async (req: Request, res: Response, next: NextFunction) => {
  // 1. Get Code and Validate
  const { state: workspaceId } = req.query;

  const code = req.query.code as string;
  if (!code) {
    throw createHttpError(500, "No code, Invalid google code");
  }

  // 2. Get Tokens from Google
  const { tokens } = await oAuth2Client.getToken(code);
  if (!tokens) {
    throw createHttpError(500, "No tokens, Invalid google tokens");
  }
  oAuth2Client.setCredentials(tokens);

  // 3. Verify the ID Token
  const ticket = await oAuth2Client.verifyIdToken({
    idToken: tokens.id_token!,
    audience: envConfig.googleClientId,
  });
  if (!ticket) {
    throw createHttpError(500, "No ticket, Invalid google ticket");
  }

  // 4. Get User Payload
  const payload = ticket.getPayload();
  if (!payload) {
    throw createHttpError(500, "No payload, Invalid google token");
  }
  const { email: channelEmail, sub: googleChannelAccountID } = payload;
  const youtube = google.youtube({ version: "v3", auth: oAuth2Client });
  const channelResponse = await youtube.channels.list({
    part: ["snippet"],
    mine: true,
  });
  const channel = channelResponse.data.items?.[0];
  if (!channel) return next(createHttpError(404, "No channel found on this account."));
  const channelName = channel.snippet?.title;
  const channelID = channel.id;

  const YoutubeChannelDoc = await YoutubeChannel.findOneAndUpdate(
    { workspaceID: workspaceId },
    {
      workspaceID: workspaceId,
      googleChannelAccountID: googleChannelAccountID,
      channelID: channelID,
      channelName: channelName,
      channelEmail: channelEmail,
      channelRefreshToken: tokens.refresh_token as string,
    },
    { upsert: true, new: true }
  );

  if (YoutubeChannelDoc) {
    await Workspace.findByIdAndUpdate(
      workspaceId,
      { youtubeChannelID: YoutubeChannelDoc._id },
      { new: true }
    );
  }

  res.status(201).redirect("http://localhost:5173/home");
};

//Fetch workspaces from DB
const fetchAllWorkSpacesDetailForUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user._id;
    const workspaces = await Workspace.find({ ownerID: userId })
      .populate("ownerID", "name email")
      .populate("youtubeChannelID", "channelID channelEmail channelName")
      .exec();
    res.status(201).json({ workspaces: workspaces });
  } catch (error) {
    next(createHttpError(500, `Error fetching workspaces: ${error}`));
  }
};

//Fetch specific workspace based on ID
const fetchSpecificWorkspaceBasedOnId = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const workspace = await Workspace.findById(req.params.workspaceId)
      .populate("ownerID", "name, email")
      .populate("youtubeChannelID", "channelID channelEmail channelName")
      .populate({
        path: "members",
        populate: [
          { path: "userID", select: "name email _id" },
          { path: "invitedBy", select: "email" },
        ],
      })
      .lean()
      .exec();
    if (!workspace) return next(createHttpError(404, "Workspace not found"));
    res.status(201).json({ workspace: workspace });
  } catch (error) {
    next(createHttpError(500, `Error fetching workspace invalid ID ${error}`));
  }
};
export {
  createWorkspace,
  channelAuthInitiator,
  channelAuthCallback,
  fetchAllWorkSpacesDetailForUser,
  fetchSpecificWorkspaceBasedOnId,
};
