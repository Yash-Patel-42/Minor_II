export interface IVideo {
  _id: string;
  title: string;
  description: string;
  url: string;
  thumbnail: string;
  uploaderID: string;
  workspaceID: string;
  status: string;
  uploadedAt: string;
  tags: string[];
  category: string;
  privacy: string;
}
