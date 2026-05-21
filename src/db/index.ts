import { Pool } from "pg";
import { createScheme } from "./schema";
import config from "../config";
export const pool = new Pool({
  connectionString: config.connection_string,
});

export const initDB = async () => {
  await createScheme();
  console.log("Database connected successfully!");
};
