import api from "@utils/axiosInstance";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import type { IVideo } from "../../types/VideoType";

const WorkspaceVideos: React.FC = () => {
  const { workspaceId } = useParams();
  const [videos, setVideos] = useState<IVideo[]>([]);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await api.get(`/videos/${workspaceId}`);
        setVideos(response.data.videos);
      } catch (error) {
        console.error("Error fetching videos:", error);
      }
    };
    fetchVideos();
  }, [workspaceId]);
  return (
    <div>
      <h1>Hellu</h1>
      {videos.length === undefined
        ? "No videos found"
        : videos.map((video) => (
            <div key={video._id} className="">
              <div className="border-1 border-border flex flex-col gap-2 border-b p-4">
                <p>{video.title}</p>
                <p>{video.description}</p>
                <p>{video.url}</p>
                <p>{video.thumbnail}</p>
                <p>{video.status}</p>
                <p>{video.uploadedAt}</p>
                <p>{video.tags}</p>
                <p>{video.category}</p>
                <p>{video.privacy}</p>
                <p>{video.uploaderID}</p>
              </div>
            </div>
          ))}
    </div>
  );
};

export default WorkspaceVideos;
