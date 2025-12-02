import { Server as HttpServer } from "http";
import { Server as SocketIOServer } from "socket.io";
import { envConfig } from "../config/config";
import createHttpError from "http-errors";
import { verify } from "jsonwebtoken";

let io: SocketIOServer;

export const initializeSocketIO = (httpServer: HttpServer) => {
  io = new SocketIOServer(httpServer, {
    cors: {
      origin: envConfig.frontendUrl,
      credentials: true,
    },
  });

  //Authentication Middleware
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) {
      return next(createHttpError(404, "Token not found"));
    }
    try {
      const decoded = verify(token, envConfig.accessTokenSecret as string);
      socket.data.user = decoded;
      next();
    } catch (error) {
      return next(createHttpError(401, `Error authenticating user for chat: ${error}`));
    }
  });

  io.on("connection", (socket) => {
    const userId = socket.data.user._id;
    console.log("New User Connected: ", socket.id);

    socket.on("join_workspace", (workspaceId: string) => {
      socket.join(`workspace:${workspaceId}`);
    });

    socket.on("join_channel", (channelId: string) => {
      socket.join(`channel:${channelId}`);
    });

    socket.on("leave_channel", (channelId: string) => {
      socket.leave(`channel:${channelId}`);
    });

    socket.on("typing_start", ({ channelId, userName }) => {
      socket.to(`channel:${channelId}`).emit("typing_start", { userId, userName });
    });

    socket.on("typing_stop", ({ channelId }) => {
      socket.to(`channel:${channelId}`).emit("typing_stop", { userId });
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });
  return io;
};

export const getIO = (): SocketIOServer => {
  if (!io) {
    throw new Error("Socket.io not initialized");
  }
  return io;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const emitNewMessage = (channelId: string, message: any) => {
  io.to(`channel:${channelId}`).emit("new_message", message);
};
