import type { ObjectId } from "mongoose";

import { ChatChannel } from "./chatChannelModel";
import { ChatMessage } from "./chatMessageModel";

export const createGeneralChatChannel = async (
  workspaceId: ObjectId,
  ownerId: ObjectId,
  initialMembers: ObjectId[]
) => {
  const generalChatChannel = await ChatChannel.create({
    workspaceId,
    name: "Workspace-wide Discussion",
    channelType: "general",
    members: initialMembers,
    createdBy: ownerId,
    isAutoManages: true,
  });

  await ChatMessage.create({
    channelId: generalChatChannel._id,
    senderId: ownerId,
    senderName: "System",
    messageContent: "Welcome to the general channel!",
    messageType: "system",
  });

  return generalChatChannel;
};

export const syncGeneralChatChannelMembers = async (
  workspaceId: ObjectId,
  currentMemberIds: ObjectId[]
) => {
  const generalChatChannel = await ChatChannel.findOne({
    workspaceId,
    isAutoManages: true,
    channelType: "general",
  });
  if (generalChatChannel) {
    generalChatChannel.members = currentMemberIds;
    await generalChatChannel.save();
  }
};

export const handleMemberRemoved = async (
  workspaceId: ObjectId,
  removedUserId: ObjectId,
  removedUserName: string
) => {
  await ChatMessage.updateMany(
    { senderId: removedUserId },
    {
      $set: {
        senderName: `${removedUserName} (Deleted User)`,
        senderAvatar: "",
      },
    }
  );

  await ChatChannel.updateMany({ workspaceId }, { $pull: { members: removedUserId } });
};
