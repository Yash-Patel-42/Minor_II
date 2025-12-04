export interface IVideo {
  _id: string;
  title: string;
  description: string;
  url: string;
  thumbnail: string;
  uploaderID: {
    _id: string;
    name: string;
    email: string;
    avatar: string;
  };
  workspaceID: string;
  status: string;
  uploadedAt: string;
  tags: string[];
  category: string;
  privacy: string;
}
