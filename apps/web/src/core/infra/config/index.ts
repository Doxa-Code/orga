import path from "node:path";
import { config as CONFIG } from "dotenv";

CONFIG({
  path: path.resolve(__dirname, "../../.env"),
});

type Config =
  | "aws.storage.name"
  | "aws.endpoint"
  | "mailsender.api_key"
  | "redis.uri";

const config = new Map<Config, any>();

config.set("aws.storage.name", process.env.AWS_BUCKET_NAME);
config.set("aws.endpoint", process.env.AWS_ENDPOINT);
config.set("mailsender.api_key", process.env.MAILSENDER_API_KEY);
config.set("redis.uri", process.env.REDIS_URI);

export default config;
