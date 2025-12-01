import { Server as HttpServer } from "http";
import { Server as SocketIOServer } from "socket.io";
import { envConfig } from "../config/config";
import { ChatMessage } from "../chat/chatMessageModel";

let io: SocketIOServer;

export const initializeSocketIO = (httpServer: HttpServer) => {
  io = new SocketIOServer(httpServer, {
    cors: {
      origin: envConfig.frontendUrl,
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("New User Connected: ", socket.id);

    socket.on("send_message", async (data) => {
      const newMessage = new ChatMessage(data);
      await newMessage.save();
      io.emit("receive_message", data);
    });
    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });
};
