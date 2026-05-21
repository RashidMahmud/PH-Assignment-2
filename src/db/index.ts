import { Pool } from "pg";
import { createScheme } from "./schema";
import config from "../config";
export const pool = new Pool({
  connectionString: config.connection_string,
});

export const initDB = async () => {
  try {
    console.log("Database connected successfully!");
  } catch (error) {
    console.log("Database Initialization Error:", error);
  }
};
  await createScheme();
  console.log("Database connected successfully!");
