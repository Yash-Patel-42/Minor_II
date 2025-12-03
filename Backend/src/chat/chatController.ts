import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import { Member } from "../workspace/workspaceMemberModel";
import { ChatChannel } from "./chatChannelModel";
import { ChatMessage } from "./chatMessageModel";
import { User } from "../user/userModel";
import { emitNewMessage } from "../socket/socketServer";

//Create Channel
const createChannel = async (req: Request, res: Response, next: NextFunction) => {
  try {
    //Get Data From Frontend
    const workspaceId = req.workspace._id;
    const { channelName, channelDescription, channelType, memberIds } = req.body;
    const userId = req.user._id;

    //Validate Incoming Data
    if (
      !channelName ||
      !channelType ||
      !memberIds ||
      !workspaceId ||
      !channelDescription ||
      !userId
    ) {
      return next(createHttpError(400, "All fields are required"));
    }

    //Check Channel Type
    if (channelType === "general") {
      return next(createHttpError(400, "General channel cannot be created"));
    }
    if (channelType === "direct_message" && memberIds.length !== 1) {
      return next(createHttpError(400, "Direct message channel must have exactly one member"));
    }
    if (channelType === "custom_group" && memberIds.length < 2) {
      return next(createHttpError(400, "Custom groups require at least 3 members"));
    }

    //Verify All Members Are Part Of Workspace
    const allMemberIds = [...memberIds, userId];
    const members = await Member.find({
      workspaceID: workspaceId,
      userID: { $in: allMemberIds },
      status: "active",
    });

    if (allMemberIds.length !== members.length) {
      return next(
        createHttpError(400, "Some members you provided are not a part of this workspace.")
      );
    }

    //Check If DM Already Exists
    if (channelType === "direct_message") {
      const existingDM = await ChatChannel.findOne({
        workspaceId,
        channelType: "direct_message",
        members: { $all: allMemberIds, $size: 2 },
      });
      if (existingDM) {
        return next(createHttpError(400, "Direct message channel already exists"));
      }

      const recipientId = allMemberIds.find((id) => id.toString() !== userId.toString());
      const recipient = await User.findById(recipientId).select("name email");

      const channel = await ChatChannel.create({
        workspaceId,
        name: `${recipient?.name}:${recipient?.email}`,
        description: channelDescription,
        channelType: "direct_message",
        members: allMemberIds,
        createdBy: userId,
        isAutoManages: false,
      });
      return res
        .status(201)
        .json({ message: "Direct message channel created successfully", channel });
    }

    //Create Channel
    const channel = await ChatChannel.create({
      workspaceId,
      name: channelName,
      description: channelDescription,
      channelType,
      members: allMemberIds,
      createdBy: userId,
      isAutoManages: false,
    });
    res.status(201).json({ message: "Channel created successfully", channel });
  } catch (error) {
    return next(createHttpError(500, `Error creating channel: ${error}`));
  }
};

//Fetch All Channels For User
const fetchAllChannelsForUser = async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.user._id;
  const workspaceId = req.workspace._id;
  if (!userId || !workspaceId) {
    return next(createHttpError(400, "User ID and workspace ID are required"));
  }

  const channels = await ChatChannel.find({
    workspaceId,
    members: userId,
  })
    .populate("members", "name email avatar")
    .sort({ createdAt: -1 })
    .lean();

  res.status(200).json({ channels });
};

//Get Messages For a Channel
const fetchChannelMessages = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const workspaceId = req.workspace._id;
    const userId = req.user._id;
    const chatChannelId = req.params.chatChannelId;
    if (!workspaceId || !userId) {
      return next(createHttpError(400, "Workspace ID and User ID are required"));
    }
    const channel = await ChatChannel.findOne({
      _id: chatChannelId,
      workspaceId,
      members: userId,
    });
    if (!channel) {
      return next(createHttpError(404, "Channel not found"));
    }

    const messages = await ChatMessage.find({ channelId: chatChannelId }).populate(
      "senderId",
      "name, email, avatar"
    );
    res.status(200).json({ messages });
  } catch (error) {
    return next(createHttpError(500, `Error fetching messages: ${error}`));
  }
};

//Send Message
const sendMessage = async (req: Request, res: Response, next: NextFunction) => {
  //Fetch Data
  const workspaceId = req.workspace._id;
  const userId = req.user._id;
  const chatChannelId = req.params.chatChannelId;
  const { messageContent, messageType, fileUrl } = req.body;

  //Validate Data
  if (!workspaceId || !userId || !chatChannelId) {
    return next(createHttpError(400, "Workspace ID, User ID, and Channel ID are required"));
  }
  if (!messageContent || !messageType) {
    return next(createHttpError(400, "Message content and type are required"));
  }

  //Check Channel Membership
  const channel = await ChatChannel.findOne({
    _id: chatChannelId,
    workspaceId,
    members: userId,
  });
  if (!channel) {
    return next(createHttpError(403, "You are not a member of this channel"));
  }

  const sender = await User.findById(userId).select("name email avatar");

  //Create Message
  const message = await ChatMessage.create({
    channelId: chatChannelId,
    senderId: sender?._id,
    senderName: sender?.name,
    senderAvatar: sender?.avatar,
    messageContent,
    messageType,
    fileUrl,
  });
  emitNewMessage(chatChannelId, message.toObject());
  res.status(201).json({ message });
};

export { fetchAllChannelsForUser, createChannel, fetchChannelMessages, sendMessage };
