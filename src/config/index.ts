import type { SignOptions } from "jsonwebtoken";
import path from "path";
import dotenv from "dotenv";
dotenv.config({
  path: path.join(process.cwd(), ".env"),
});

const config = {
  connection_string: process.env.CONNECTIONSTRING as string,
  port: parseInt(process.env.PORT || "5000", 10),
  secret: process.env.JWT_SECRET as string,
  refresh_secret: process.env.JWT_REFRESH_SECRET as string,
  node_env: process.env.NODE_ENV || "development",
  access_expires_in: (process.env.JWT_ACCESS_EXPIRES_IN || "7d") as string,
  refresh_expires_in: (process.env.JWT_REFRESH_EXPIRES_IN || "30d") as string,
};
export default config;
