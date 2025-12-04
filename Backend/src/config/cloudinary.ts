import { v2 as cloudinary } from "cloudinary";

import { envConfig } from "./config";

cloudinary.config({
  cloud_name: envConfig.cloudinaryCloudName as string,
  api_key: envConfig.cloudinaryApiKey as string,
  api_secret: envConfig.cloudinaryApiSecret as string,
  secure: true,
});
export default cloudinary;
