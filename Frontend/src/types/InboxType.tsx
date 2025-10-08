export interface IInbox {
  _id: string;
  sender: { email: string; name: string };
  receiver?: string;
  type: string;
  payload: {
    role: string;
    workspaceId: string;
    receiverEmail: string;
    workspaceName: string;
    workspaceDescription: string;
  };
  isRead: boolean;
}
