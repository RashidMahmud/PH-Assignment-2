import type { SignOptions } from "jsonwebtoken";
import path from "path";
import dotenv from "dotenv";
dotenv.config({
  path: path.join(process.cwd(), ".env"),
});

const config = {
  connection_string: process.env.CONNECTIONSTRING as string,
  port: process.env.PORT,
  secret: process.env.JWT_SECRET,
  refresh_secret: process.env.JWT_REFRESH_SECRET,
  node_env: process.env.NODE_ENV,
  access_expires_in: (process.env.JWT_ACCESS_EXPIRES_IN || "1d") as string,
  refresh_expires_in: (process.env.JWT_REFRESH_EXPIRES_IN) as string,
};
export default config;
