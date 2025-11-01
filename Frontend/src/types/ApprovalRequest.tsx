export interface IApprovalRequest {
  _id: string;
  video: {
    _id: string;
    title: string;
    description: string;
    url: string;
    thumbnail: string;
    uploaderID: string;
    uploadedAt: string;
    workspaceID: string;
    status: string;
  };
  workspace: string;
  requester: { _id: string; name: string; email: string };
  approvers: [{ _id: string; name: string; email: string } ];
  status: 'pending' | 'approved' | 'rejected' | 'cancelled' | 'need_edits' | 'reuploaded';
  response: string;
  summary: string;
  payload: object;
}
