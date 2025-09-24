import { config } from "dotenv";
config();
const _envConfig = {
  port: process.env.PORT,
  mongoConnectionUri: process.env.MONGO_CONNECTION_URI,
  environment: process.env.NODE_ENV,
  accessTokenSecret: process.env.ACCESS_TOKEN_SECRET,
  refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET,
};
export const envConfig = Object.freeze(_envConfig);
