import cookieParser from "cookie-parser";
import cors from "cors";
import type { Request, Response } from "express";
import express from "express";

import approvalRequestRouter from "./approval/approvalRequestRouter";
import chatRouter from "./chat/chatRouter";
import { envConfig } from "./config/config";
import inboxRouter from "./inbox/inboxRouter";
import globalErrorHandler from "./middlewares/globalErrorHandler";
import userRouter from "./user/userRouter";
import videoRouter from "./video/videoRouter";
import workspaceRouter from "./workspace/workspaceRouter";
import youtubeChannelRouter from "./youtubeChannel/youtubeChannelRouter";

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: [envConfig.frontendUrl as string, "http://localhost:3001"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  })
);
app.use((req, res, next) => {
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin-allow-popups");
  res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
  next();
});

app.get("/", (req: Request, res: Response) => {
  res.json({ message: "Welcome to Minor-II" });
});
app.use("/api/users", userRouter);
app.use("/api", workspaceRouter);
app.use("/api", inboxRouter);
app.use("/api", videoRouter);
app.use("/api", approvalRequestRouter);
app.use("/api/channel", youtubeChannelRouter);
app.use("/api/chat", chatRouter);

// Global error handler
app.use(globalErrorHandler);

export default app;
