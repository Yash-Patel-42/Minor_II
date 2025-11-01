import { config } from "dotenv";
config();
const _envConfig = {
  port: process.env.PORT,
  mongoConnectionUri: process.env.MONGO_CONNECTION_URI,
  environment: process.env.NODE_ENV,
  accessTokenSecret: process.env.ACCESS_TOKEN_SECRET,
  refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET,
  inviteTokenSecret: process.env.INVITE_TOKEN_SECRET,
  googleClientId: process.env.GOOGLE_CLIENT_ID,
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
  googleLoginRedirectUri: process.env.GOOGLE_LOGIN_REDIRECT_URI,
  googleChannelAuthRedirectUri: process.env.GOOGLE_CHANNEL_AUTH_REDIRECT_URI,
  frontendUrl: process.env.FRONTEND_URI,
  cloudinaryUrl: process.env.CLOUDINARY_URL,
  cloudinaryApiKey: process.env.CLOUDINARY_API_KEY,
  cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET,
  cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME,
};
export const envConfig = Object.freeze(_envConfig);
