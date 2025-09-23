import app from "./app";
import { envConfig } from "./config/config";
import connectDB from "./config/db";

const startServer = async () => {
  //Database Connection
  await connectDB();
  //Define PORT
  const port = envConfig.port || 3000;
  // Listen PORT
  app.listen(port, () => {
    console.log(`Listening on PORT: ${port}`);
  });
};

startServer();
