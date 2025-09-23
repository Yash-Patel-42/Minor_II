import { config } from "dotenv";
config();
const _envConfig = {
  port: process.env.PORT,
  mongoConnectionUri: process.env.MONGO_CONNECTION_URI,
  environment: process.env.NODE_ENV
};
export const envConfig = Object.freeze(_envConfig);