import axios from "axios";

import { config } from "@/config/config";

export const getViews = () => {
  // This is a mock implementation. In production, this would call the YouTube API
  const mockViews = {
    total: "150,000",
    last24Hours: "5,200",
    lastWeek: "32,400",
  };
  return JSON.stringify(mockViews);
};

export function channelAnalytics() {
  // This is a mock implementation. In production, this would call the YouTube API
  const mockAnalytics = {
    views: {
      total: "150,000",
      last24Hours: "5,200",
    },
    subscribers: {
      total: "10,500",
      gained24Hours: "120",
    },
    engagement: {
      averageViewDuration: "5:45",
      likeRate: "95%",
    },
  };
  return JSON.stringify(mockAnalytics);
}

export const searchWeb = async (query: string) => {
  const res = await axios.post(
    "https://google.serper.dev/search",
    { q: query },
    {
      headers: { "X-API-KEY": config.get("SERPER_API_KEY") },
    },
  );
  return res.data.organic?.[0]?.snippet || "No data found.";
};
