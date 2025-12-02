export interface IChatMessage {
  _id: string;
  channelID: string;
  senderID: string;
  senderName: string;
  senderAvatar?: string;
  messageContent: string;
  messageType: "text" | "file" | "image" | "system";
  isEdited: boolean;
  createdAt: string;
}

export interface IChatChannel {
  _id: string;
  workspaceID: string;
  name: string;
  description?: string;
  channelType: "general" | "custom_group" | "direct_message";
  members: string[];
  latestMessage?: IChatMessage;
}
