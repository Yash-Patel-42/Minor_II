export interface IWorkspace {
  _id: string;
  workspaceName: string;
  workspaceDescription: string;
  ownerID: {
    name: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
  youtubeChannelID?: {
    channelID: string;
    channelName: string;
    channelEmail: string;
  };
}
