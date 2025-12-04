import mongoose from "mongoose";

import { envConfig } from "./config";
const connectDB = async () => {
  try {
    mongoose.connection.on("connected", () => {
      console.log("Connected to database successfully");
    });
    mongoose.connection.on("error", (error) => {
      console.log("Error connecting to database", error);
    });
    await mongoose.connect(envConfig.mongoConnectionUri as string);
  } catch (error) {
    console.log("Failed to connect to database", error);
    process.exit(1);
  }
};
export default connectDB;
