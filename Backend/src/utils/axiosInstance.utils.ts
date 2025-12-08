import axios from "axios";

import { envConfig } from "../config/config";

export const api = axios.create({
  baseURL: envConfig.agentUri as string,
  withCredentials: true,
});
