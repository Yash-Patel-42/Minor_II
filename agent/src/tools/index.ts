import { DynamicTool } from "langchain";

import { findCurrenttime } from "./general.tools";
import {
  channelAnalytics,
  getViews,
  searchWeb,
} from "./youtubeAssistance.tools";

export const tools = [
  new DynamicTool({
    name: "getViewsOnChannel",
    description: "Get the current view count for your YouTube channel",
    func: getViews,
    type: "function",
  }),
  new DynamicTool({
    name: "channelAnalytics",
    description:
      "Get detailed analytics for your YouTube channel including views, watch time, and engagement metrics",
    func: channelAnalytics,
    type: "function",
  }),
  new DynamicTool({
    name: "searchWeb",
    description: "Search the web for information about a specific topic",
    func: searchWeb,
    type: "function",
  }),
  new DynamicTool({
    name: "findCurrenttime",
    description: "Get the current time in UTC format",
    func: findCurrenttime,
    type: "function",
  }),
];
