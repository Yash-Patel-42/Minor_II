import api from "@utils/axiosInstance";
import React, { useEffect, useState } from "react";
import { FaPlay } from "react-icons/fa";
import { HiOutlineVideoCamera } from "react-icons/hi";
import { useParams } from "react-router";
import type { IVideo } from "../../types/VideoType";

const WorkspaceVideos: React.FC = () => {
  const { workspaceId } = useParams();
  const [videos, setVideos] = useState<IVideo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await api.get(`/videos/${workspaceId}`);
        setVideos(response.data.videos);
        console.log(response.data.videos);
      } catch (error) {
        console.error("Error fetching videos:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchVideos();
  }, [workspaceId]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return `${Math.floor(diffDays / 365)} years ago`;
  };

  if (loading) {
    return (
      <div className="bg-background min-h-screen px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-[1800px]">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-background-raised mb-3 aspect-video rounded-xl"></div>
                <div className="flex gap-3">
                  <div className="bg-background-raised h-9 w-9 shrink-0 rounded-full"></div>
                  <div className="flex-1 space-y-2">
                    <div className="bg-background-raised h-4 rounded"></div>
                    <div className="bg-background-raised h-3 w-2/3 rounded"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (videos.length === 0) {
    return (
      <div className="bg-background flex min-h-screen items-center justify-center px-4">
        <div className="text-center">
          <div className="mb-6 flex justify-center">
            <div className="bg-background-raised rounded-full p-6">
              <HiOutlineVideoCamera className="text-text-muted h-16 w-16" />
            </div>
          </div>
          <h3 className="text-text mb-2 text-xl font-bold">
            No videos uploaded yet
          </h3>
          <p className="text-text-muted max-w-md text-sm">
            Videos uploaded to this workspace will appear here. Start by
            uploading your first video to YouTube through this workspace.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1800px]">
        {/* Video Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
          {videos.map((video) => (
            <div
              key={video._id}
              className="group cursor-pointer"
              onClick={() => window.open(video.url, "_blank")}
            >
              {/* Thumbnail Container */}
              <div className="bg-background-raised relative mb-3 overflow-hidden rounded-xl">
                <div className="aspect-video">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
                  />
                </div>

                {/* Play Button Overlay */}
                <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors group-hover:bg-black/40">
                  <div className="scale-0 rounded-full bg-black/80 p-3 transition-transform group-hover:scale-100">
                    <FaPlay className="h-5 w-5 text-white" />
                  </div>
                </div>

                {/* Status Badge */}
                {video.status && (
                  <div className="absolute right-2 top-2">
                    <span
                      className={`rounded px-2 py-1 text-xs font-medium ${
                        video.status.toLowerCase() === "public"
                          ? "bg-success-bg text-success"
                          : video.status.toLowerCase() === "private"
                            ? "bg-error-bg text-error"
                            : "bg-warning-bg text-warning"
                      }`}
                    >
                      {video.status}
                    </span>
                  </div>
                )}
              </div>

              {/* Video Info */}
              <div className="flex gap-3">
                {/* Channel Avatar */}
                <div className="shrink-0">
                  <div className="bg-primary text-text-inverted flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold">
                    {video?.uploaderID?.name}
                  </div>
                </div>

                {/* Title and Metadata */}
                <div className="min-w-0 flex-1">
                  <h3 className="text-text group-hover:text-primary mb-1 line-clamp-2 text-sm font-semibold">
                    {video.title}
                  </h3>

                  <p className="text-text-muted mb-0.5 text-xs">Channel</p>

                  <div className="text-text-muted flex items-center gap-1 text-xs">
                    <span>{formatDate(video.uploadedAt)}</span>
                  </div>

                  {/* Tags */}
                  {video.tags && video.tags.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {video.tags.slice(0, 2).map((tag, index) => (
                        <span
                          key={index}
                          className="bg-background-raised text-text-muted rounded px-2 py-0.5 text-xs"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WorkspaceVideos;
