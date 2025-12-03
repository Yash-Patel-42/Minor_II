import app from "./app";
import { envConfig } from "./config/config";
import connectDB from "./config/db";
import http from "http";
import { initializeSocketIO } from "./socket/socketServer";

const startServer = async () => {
  //Database Connection
  await connectDB();
  //Define PORT
  const port = envConfig.port || 3000;

  //HTTP Server
  const httpServer = http.createServer(app);
  initializeSocketIO(httpServer);

  // Listen PORT
  httpServer.listen(port, () => {
    console.log(`Listening on PORT: ${port}`);
  });
};

startServer();
