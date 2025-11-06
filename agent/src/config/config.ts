import { config as conf } from "dotenv";

conf();

const _config: { [key: string]: string } = {
  GROQ_API_KEY: process.env.GROQ_API_KEY as string,
  GEMINI_API_KEY: process.env.GEMINI_API_KEY as string,
  SERPER_API_KEY: process.env.SERPER_API_KEY as string,
  PORT: process.env.PORT as string,
};

export const config = {
  get(key: string) {
    const value = _config[key];

    if (!value) {
      console.error(`The ${key} not found, please provide correct key`);
      process.exit();
    }
    return value;
  },
};
