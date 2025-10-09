export interface IWorkspace {
  _id: string;
  workspaceName: string;
  workspaceDescription: string;
  ownerID: {
    name: string;
    email: string;
    _id: string;
  };
  createdAt: string;
  updatedAt: string;
  youtubeChannelID?: {
    channelID: string;
    channelName: string;
    channelEmail: string;
  };
  members?: [
    {
      invitedBy: { email: string };
      role: string;
      status: string;
      userID: { email: string; name: string; _id: string };
    }
  ];
}
